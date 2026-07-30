import "@tanstack/react-start/server-only"
import type { CreateContactOptions, CreateEmailOptions } from "resend"
import type { ConfirmationMailer, ConfirmedContact, WishlistContacts } from "./ports.server"
import { createConfirmationEmail } from "./confirmation-email.server"
import { isRecord } from "./contract"
import { ConfirmationDeliveryError } from "./ports.server"

const RESEND_API_ORIGIN = "https://api.resend.com"
const RESEND_TIMEOUT = 8_000
const SEND_ATTEMPTS = 2
const SEND_RETRY_DELAY = 250

type ResendProperty =
  | string
  | number
  | null
  | {
      type: "string" | "number"
      value: string | number
    }

type ResendContact = {
  id: string
  email: string
  unsubscribed: boolean
  properties: Record<string, ResendProperty>
}

type ResendSegmentList = {
  object: "list"
  data: { id: string }[]
  has_more: boolean
}

type ResendConfig = {
  apiKey: string
  contactsApiKey: string
  from: string
  replyTo: string
  segmentId: string
}

type ResendRequest = {
  apiKey: string
  operation: string
  path: string
  method?: "GET" | "POST" | "PATCH"
  body?: unknown
  idempotencyKey?: string
  responseMode?: "json" | "ignore"
}

export class ResendProviderError extends ConfirmationDeliveryError {
  constructor(
    readonly operation: string,
    readonly statusCode: number | null,
    deliveryState: "rejected" | "unknown" = "unknown"
  ) {
    super(deliveryState, `Resend ${operation} failed`)
  }
}

export function createResendAdapters(config: ResendConfig): {
  contacts: WishlistContacts
  mailer: ConfirmationMailer
} {
  async function requestContact(email: string) {
    const response = await resendRequest({
      apiKey: config.contactsApiKey,
      operation: "get_contact",
      path: `/contacts/${encodeURIComponent(email)}`,
    })

    if (response.status === 404) return null
    if (!response.ok || !isResendContact(response.data)) {
      throw new ResendProviderError("get_contact", response.status)
    }
    return response.data
  }

  async function hasWishlistSegment(email: string) {
    let after: string | null = null

    while (true) {
      const query = new URLSearchParams({ limit: "100" })
      if (after) query.set("after", after)
      const response = await resendRequest({
        apiKey: config.contactsApiKey,
        operation: "list_contact_segments",
        path: `/contacts/${encodeURIComponent(email)}/segments?${query}`,
      })

      if (!response.ok || !isResendSegmentList(response.data)) {
        throw new ResendProviderError("list_contact_segments", response.status)
      }
      if (response.data.data.some((segment) => segment.id === config.segmentId)) return true
      if (!response.data.has_more) return false

      after = response.data.data.at(-1)?.id ?? null
      if (!after) throw new ResendProviderError("list_contact_segments", null)
    }
  }

  const contacts: WishlistContacts = {
    async get(email) {
      const contact = await requestContact(email)
      if (!contact) return null

      return {
        email: contact.email,
        unsubscribed: contact.unsubscribed,
        consentId: stringProperty(contact, "consent_id"),
        confirmedAt: dateProperty(contact, "confirmed_at"),
      }
    },

    async createConfirmed(contact) {
      const body = {
        email: contact.email,
        unsubscribed: false,
        properties: contactProperties(contact),
        segments: [{ id: config.segmentId }],
      } satisfies CreateContactOptions
      const response = await resendRequest({
        apiKey: config.contactsApiKey,
        operation: "create_contact",
        path: "/contacts",
        method: "POST",
        body,
      })

      if (response.ok) return "created"

      const concurrentContact = await requestContact(contact.email)
      if (concurrentContact) return "conflict"

      throw new ResendProviderError("create_contact", response.status)
    },

    async ensureWishlistSegment(email) {
      const response = await resendRequest({
        apiKey: config.contactsApiKey,
        operation: "add_contact_segment",
        path: `/contacts/${encodeURIComponent(email)}/segments/${config.segmentId}`,
        method: "POST",
      })

      if (response.status === 409 && (await hasWishlistSegment(email))) return
      if (!response.ok) {
        throw new ResendProviderError("add_contact_segment", response.status)
      }
    },

    async updateConfirmed(contact) {
      const response = await resendRequest({
        apiKey: config.contactsApiKey,
        operation: "update_contact",
        path: `/contacts/${encodeURIComponent(contact.email)}`,
        method: "PATCH",
        body: {
          unsubscribed: false,
          properties: contactProperties(contact),
        },
      })

      if (!response.ok) {
        throw new ResendProviderError("update_contact", response.status)
      }
    },
  }

  return {
    contacts,
    mailer: createMailer(config),
  }
}

function createMailer(config: ResendConfig): ConfirmationMailer {
  return {
    async send({ email, confirmationUrl, consentId }) {
      const content = createConfirmationEmail(confirmationUrl)
      const message = {
        from: config.from,
        to: email,
        replyTo: config.replyTo,
        subject: content.subject,
        html: content.html,
        text: content.text,
        tags: [{ name: "category", value: "wishlist_confirmation" }],
      } satisfies CreateEmailOptions
      await sendWithRetry({
        apiKey: config.apiKey,
        operation: "send_confirmation",
        path: "/emails",
        method: "POST",
        idempotencyKey: `wishlist-confirm/${consentId}`,
        responseMode: "ignore",
        body: {
          from: message.from,
          to: message.to,
          reply_to: message.replyTo,
          subject: message.subject,
          html: message.html,
          text: message.text,
          tags: message.tags,
        },
      })
    },
  }
}

async function sendWithRetry(request: ResendRequest) {
  for (let attempt = 0; attempt < SEND_ATTEMPTS; attempt += 1) {
    let failure: ResendProviderError

    try {
      const response = await resendRequest(request)
      if (response.ok) return

      failure = new ResendProviderError(
        request.operation,
        response.status,
        deliveryStateFor(response.status, response.errorName)
      )
    } catch (error) {
      if (!(error instanceof ResendProviderError)) throw error
      failure = error
    }

    if (failure.deliveryState === "rejected" || attempt === SEND_ATTEMPTS - 1) {
      throw failure
    }

    await wait(SEND_RETRY_DELAY)
  }
}

async function resendRequest({
  apiKey,
  operation,
  path,
  method = "GET",
  body,
  idempotencyKey,
  responseMode = "json",
}: ResendRequest) {
  const headers = new Headers({
    authorization: `Bearer ${apiKey}`,
    "content-type": "application/json",
    "user-agent": "makes-mistakes-wishlist",
  })
  if (idempotencyKey) headers.set("idempotency-key", idempotencyKey)

  let response: Response
  try {
    response = await fetch(`${RESEND_API_ORIGIN}${path}`, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(RESEND_TIMEOUT),
    })
  } catch {
    throw new ResendProviderError(operation, null)
  }

  if (!response.ok) {
    const errorName = await readErrorName(response)
    return { ok: false as const, status: response.status, data: null, errorName }
  }

  if (response.status === 204 || responseMode === "ignore") {
    await response.body?.cancel()
    return { ok: true as const, status: response.status, data: null, errorName: null }
  }

  try {
    const data: unknown = await response.json()
    return { ok: true as const, status: response.status, data, errorName: null }
  } catch {
    throw new ResendProviderError(operation, response.status)
  }
}

async function readErrorName(response: Response) {
  try {
    const body: unknown = await response.json()
    return isRecord(body) && typeof body.name === "string" ? body.name : null
  } catch {
    return null
  }
}

function deliveryStateFor(status: number, errorName: string | null) {
  if (
    status === 408 ||
    status >= 500 ||
    (status === 409 && errorName !== "invalid_idempotent_request")
  ) {
    return "unknown" as const
  }
  return "rejected" as const
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds))
}

function contactProperties(contact: ConfirmedContact) {
  return {
    confirmed_at: new Date(contact.confirmedAt).toISOString(),
    consent_version: contact.consentVersion,
    consent_source: contact.consentSource,
    consent_id: contact.consentId,
  }
}

function isResendContact(value: unknown): value is ResendContact {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.email === "string" &&
    typeof value.unsubscribed === "boolean" &&
    isRecord(value.properties)
  )
}

function isResendSegmentList(value: unknown): value is ResendSegmentList {
  return (
    isRecord(value) &&
    value.object === "list" &&
    Array.isArray(value.data) &&
    value.data.every((segment) => isRecord(segment) && typeof segment.id === "string") &&
    typeof value.has_more === "boolean"
  )
}

function stringProperty(contact: ResendContact, name: string) {
  const property = contact.properties[name]
  if (typeof property === "string") return property
  if (!property || typeof property !== "object") return null
  return property.type === "string" && typeof property.value === "string" ? property.value : null
}

function dateProperty(contact: ResendContact, name: string) {
  const value = stringProperty(contact, name)
  if (!value) return null

  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? null : timestamp
}
