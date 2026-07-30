import { describe, expect, it } from "vitest"
import type { ConfirmationToken } from "./token.server"
import { decideConfirmation, type WishlistContact } from "./ports.server"

const TOKEN: ConfirmationToken = {
  tokenVersion: 1,
  purpose: "wishlist-confirmation",
  email: "person@example.com",
  consentId: "AAAAAAAAAAAAAAAAAAAAAA",
  consentVersion: "2026-07-29",
  issuedAt: 2_000,
  expiresAt: 2_000 + 7 * 24 * 60 * 60 * 1_000,
}

function contact(overrides: Partial<WishlistContact> = {}): WishlistContact {
  return {
    email: TOKEN.email,
    unsubscribed: false,
    consentId: "BBBBBBBBBBBBBBBBBBBBBB",
    confirmedAt: 1_000,
    ...overrides,
  }
}

describe("confirmation state decisions", () => {
  it("does not restore an unsubscribe with the same consent", () => {
    expect(
      decideConfirmation(contact({ consentId: TOKEN.consentId, unsubscribed: true }), TOKEN)
    ).toBe("ignore-stale-or-unsubscribed-replay")
  })

  it("does not apply a token issued before the latest confirmation", () => {
    expect(decideConfirmation(contact({ confirmedAt: TOKEN.issuedAt }), TOKEN)).toBe(
      "ignore-stale-or-unsubscribed-replay"
    )
  })

  it("accepts a newer consent after an unsubscribe", () => {
    expect(decideConfirmation(contact({ unsubscribed: true }), TOKEN)).toBe("apply-new-consent")
  })

  it("repairs segment membership for an active idempotent replay", () => {
    expect(decideConfirmation(contact({ consentId: TOKEN.consentId }), TOKEN)).toBe(
      "repair-segment"
    )
  })
})
