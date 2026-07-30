import "@tanstack/react-start/server-only"
import type { ConfirmationToken } from "./token.server"

export type WishlistContact = {
  email: string
  unsubscribed: boolean
  consentId: string | null
  confirmedAt: number | null
}

export type ConfirmedContact = {
  email: string
  consentId: string
  consentVersion: string
  consentSource: "website"
  confirmedAt: number
}

export interface WishlistContacts {
  get(email: string): Promise<WishlistContact | null>
  createConfirmed(contact: ConfirmedContact): Promise<"created" | "conflict">
  ensureWishlistSegment(email: string): Promise<void>
  updateConfirmed(contact: ConfirmedContact): Promise<void>
}

export interface ConfirmationMailer {
  send(input: { email: string; confirmationUrl: string; consentId: string }): Promise<void>
}

export interface SubscriptionThrottle {
  reserve(input: {
    emailFingerprint: string
    clientFingerprint: string | null
    consentId: string
  }): Promise<"allowed" | "cooldown" | "busy" | "rate-limit">
  commit(input: { emailFingerprint: string; consentId: string }): Promise<void>
  release(input: {
    emailFingerprint: string
    clientFingerprint: string | null
    consentId: string
  }): Promise<void>
}

export interface HumanVerifier {
  verify(input: { token: string; hostname: string }): Promise<boolean>
}

export type WishlistDependencies = {
  appOrigin: string
  secret: string
  contacts: WishlistContacts
  mailer: ConfirmationMailer
  throttle: SubscriptionThrottle
  verifier: HumanVerifier
  now: () => number
}

export class ConfirmationDeliveryError extends Error {
  constructor(
    readonly deliveryState: "rejected" | "unknown",
    message = "Confirmation delivery failed"
  ) {
    super(message)
  }
}

export type ConfirmDecision =
  | "create"
  | "apply-new-consent"
  | "repair-segment"
  | "ignore-stale-or-unsubscribed-replay"

export function decideConfirmation(
  contact: WishlistContact | null,
  token: ConfirmationToken
): ConfirmDecision {
  if (!contact) return "create"

  if (contact.consentId === token.consentId) {
    return contact.unsubscribed ? "ignore-stale-or-unsubscribed-replay" : "repair-segment"
  }

  if (contact.confirmedAt !== null && token.issuedAt <= contact.confirmedAt) {
    return "ignore-stale-or-unsubscribed-replay"
  }

  return "apply-new-consent"
}
