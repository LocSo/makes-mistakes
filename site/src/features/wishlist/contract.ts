export const CONSENT_VERSION = "2026-07-29"
export const TURNSTILE_ACTION = "wishlist_signup"

export type SubscribeResponse = {
  status: "check_email"
}

export type ConfirmResponse = {
  status: "confirmed" | "inactive"
}

export function isSubscribeResponse(value: unknown): value is SubscribeResponse {
  return isRecord(value) && value.status === "check_email"
}

export function isConfirmResponse(value: unknown): value is ConfirmResponse {
  return isRecord(value) && (value.status === "confirmed" || value.status === "inactive")
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}
