import "@tanstack/react-start/server-only"
import { getRequestIP, getRequestUrl } from "@tanstack/react-start/server"
import { createResendAdapters } from "./resend.server"
import { createWishlistService } from "./service.server"
import { createUpstashThrottle } from "./throttle.server"
import { createTurnstileVerifier } from "./turnstile.server"

const LOCAL_SECRET = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"

export function createWishlistRuntime(request: Request) {
  const providers = createProviderAdapters()

  if (import.meta.env.DEV) {
    const requestOrigin = getRequestUrl({
      xForwardedHost: false,
      xForwardedProto: true,
    }).origin
    const dependencies = {
      appOrigin: requestOrigin,
      secret: LOCAL_SECRET,
      ...providers,
      verifier: createConfiguredTurnstileVerifier(),
      now: Date.now,
    }

    return {
      appOrigin: dependencies.appOrigin,
      clientAddress: getRequestIP({ xForwardedFor: true }) ?? null,
      requestOrigin,
      service: createWishlistService(dependencies),
    }
  }

  const requestOrigin = new URL(request.url).origin
  const appOrigin = requiredOrigin("APP_ORIGIN")
  const dependencies = {
    appOrigin,
    secret: requiredEnv("WISHLIST_SECRET"),
    ...providers,
    verifier: createConfiguredTurnstileVerifier(),
    now: Date.now,
  }

  return {
    appOrigin,
    clientAddress: getRequestIP({ xForwardedFor: true }) ?? null,
    requestOrigin,
    service: createWishlistService(dependencies),
  }
}

function createProviderAdapters() {
  return {
    ...createResendAdapters({
      apiKey: requiredEnv("RESEND_API_KEY"),
      contactsApiKey: requiredEnv("RESEND_CONTACTS_API_KEY"),
      from: requiredEnv("RESEND_FROM"),
      replyTo: requiredEnv("RESEND_REPLY_TO"),
      segmentId: requiredEnv("RESEND_SEGMENT_ID"),
    }),
    throttle: createUpstashThrottle({
      url: requiredEnv("UPSTASH_REDIS_REST_URL"),
      token: requiredEnv("UPSTASH_REDIS_REST_TOKEN"),
    }),
  }
}

function createConfiguredTurnstileVerifier() {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim()
  if (!siteKey) {
    return {
      verify: async () => true,
    }
  }

  return createTurnstileVerifier({
    secretKey: requiredEnv("TURNSTILE_SECRET_KEY"),
  })
}

function requiredEnv(name: string) {
  const value = optionalEnv(name)
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

function optionalEnv(name: string) {
  return process.env[name]?.trim() || null
}

function requiredOrigin(name: string) {
  const value = requiredEnv(name)
  const url = new URL(value)
  if (url.origin !== value || url.username || url.password) {
    throw new Error(`${name} must be an origin without a trailing slash`)
  }
  return value
}
