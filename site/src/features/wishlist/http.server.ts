import "@tanstack/react-start/server-only"
import { isRecord } from "./contract"
import { ResendProviderError } from "./resend.server"
import { createWishlistRuntime } from "./runtime.server"
import {
  ExpiredConfirmationTokenError,
  InvalidConfirmationTokenError,
  isValidEmail,
  normalizeEmail,
} from "./token.server"

const MAX_BODY_BYTES = 8 * 1_024
const MAX_TURNSTILE_TOKEN_LENGTH = 2_048
const NO_STORE_HEADERS = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
}

export function methodNotAllowedResponse() {
  logEvent("wishlist_method_rejected", "method_not_allowed", 405)
  return new Response(JSON.stringify({ error: "method_not_allowed" }), {
    status: 405,
    headers: { ...NO_STORE_HEADERS, allow: "POST" },
  })
}

export async function handleSubscribeRequest(request: Request) {
  if (!hasJsonContentType(request)) {
    return rejectSubscribe("unsupported_media_type", { error: "unsupported_media_type" }, 415)
  }

  let runtime
  try {
    runtime = createWishlistRuntime(request)
  } catch (error) {
    logFailure("wishlist_subscribe_failed", "configuration_failed", 503, error)
    return json({ error: "unavailable" }, 503)
  }

  const hostname = getValidatedRequestHostname(request, runtime.requestOrigin, runtime.appOrigin)
  if (!hostname) return rejectSubscribe("invalid_origin", { error: "forbidden" }, 403)

  let body: unknown
  try {
    body = await readJson(request)
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return rejectSubscribe("body_too_large", { error: "body_too_large" }, 413)
    }
    return rejectSubscribe("invalid_json", { error: "invalid_json" }, 400)
  }

  if (!isSubscribeBody(body)) {
    return rejectSubscribe("invalid_request", { error: "invalid_request" }, 400)
  }
  if (body.website) return rejectSubscribe("honeypot", { error: "forbidden" }, 403)

  const email = normalizeEmail(body.email)
  if (!isValidEmail(email)) {
    return rejectSubscribe("invalid_email", { error: "invalid_email" }, 422)
  }

  try {
    const result = await runtime.service.subscribe({
      email,
      clientAddress: runtime.clientAddress,
      turnstileToken: body.turnstileToken,
      hostname,
    })

    if (result.status === "verification-failed") {
      return rejectSubscribe("verification_failed", { error: "forbidden" }, 403)
    }
    if (result.status === "rate-limited") {
      return rejectSubscribe("rate_limited", { error: "rate_limited" }, 429)
    }
    if (result.status === "retry-later") {
      return rejectSubscribe("request_in_flight", { error: "unavailable" }, 503)
    }

    const response = json({ status: "check_email" }, 202)
    logEvent("wishlist_subscribe_completed", "accepted", 202)
    return response
  } catch (error) {
    logFailure("wishlist_subscribe_failed", "unexpected_failure", 503, error)
    return json({ error: "unavailable" }, 503)
  }
}

export function getValidatedRequestHostname(
  request: Request,
  requestOrigin: string,
  appOrigin: string
) {
  if (requestOrigin !== appOrigin) return null
  if (request.headers.get("origin") !== appOrigin) return null
  return new URL(appOrigin).hostname
}

export async function handleConfirmRequest(request: Request) {
  if (!hasJsonContentType(request)) {
    return rejectConfirm("unsupported_media_type", { error: "unsupported_media_type" }, 415)
  }

  let runtime
  try {
    runtime = createWishlistRuntime(request)
  } catch (error) {
    logFailure("wishlist_confirm_failed", "configuration_failed", 503, error)
    return json({ error: "unavailable" }, 503)
  }

  if (!getValidatedRequestHostname(request, runtime.requestOrigin, runtime.appOrigin))
    return rejectConfirm("invalid_origin", { error: "forbidden" }, 403)

  let body: unknown
  try {
    body = await readJson(request)
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return rejectConfirm("body_too_large", { error: "body_too_large" }, 413)
    }
    return rejectConfirm("invalid_json", { error: "invalid_json" }, 400)
  }

  if (!isConfirmBody(body)) {
    return rejectConfirm("invalid_request", { error: "invalid_request" }, 400)
  }

  try {
    const result = await runtime.service.confirm(body.token)
    logEvent("wishlist_confirm_completed", result.status, 200)
    return json(result, 200)
  } catch (error) {
    if (error instanceof ExpiredConfirmationTokenError) {
      return rejectConfirm("expired_token", { error: "expired_token" }, 410)
    }
    if (error instanceof InvalidConfirmationTokenError) {
      return rejectConfirm("invalid_token", { error: "invalid_token" }, 400)
    }

    logFailure("wishlist_confirm_failed", "unexpected_failure", 503, error)
    return json({ error: "unavailable" }, 503)
  }
}

function isSubscribeBody(
  value: unknown
): value is { email: string; website: string; turnstileToken: string } {
  return (
    isRecord(value) &&
    typeof value.email === "string" &&
    typeof value.website === "string" &&
    typeof value.turnstileToken === "string" &&
    value.turnstileToken.length <= MAX_TURNSTILE_TOKEN_LENGTH
  )
}

function isConfirmBody(value: unknown): value is { token: string } {
  return isRecord(value) && typeof value.token === "string" && value.token.length > 0
}

function hasJsonContentType(request: Request) {
  return request.headers.get("content-type")?.split(";", 1)[0].trim() === "application/json"
}

async function readJson(request: Request) {
  const contentLength = Number(request.headers.get("content-length"))
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new BodyTooLargeError()
  }
  if (!request.body) throw new SyntaxError()

  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let bytesRead = 0
  let text = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    bytesRead += value.byteLength
    if (bytesRead > MAX_BODY_BYTES) {
      await reader.cancel()
      throw new BodyTooLargeError()
    }
    text += decoder.decode(value, { stream: true })
  }
  text += decoder.decode()

  return JSON.parse(text)
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: NO_STORE_HEADERS,
  })
}

function rejectSubscribe(reason: string, body: unknown, status: number) {
  logEvent("wishlist_subscribe_rejected", reason, status)
  return json(body, status)
}

function rejectConfirm(reason: string, body: unknown, status: number) {
  logEvent("wishlist_confirm_rejected", reason, status)
  return json(body, status)
}

function logEvent(event: string, reason: string, status: number) {
  console.info(event, { reason, status })
}

function logFailure(event: string, reason: string, status: number, error: unknown) {
  if (error instanceof ResendProviderError) {
    console.error(event, {
      reason,
      status,
      provider: {
        operation: error.operation,
        statusCode: error.statusCode,
      },
    })
    return
  }

  console.error(event, { reason, status })
}

class BodyTooLargeError extends Error {}
