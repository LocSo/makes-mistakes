import { describe, expect, it, vi } from "vitest"
import {
  ConfirmationDeliveryError,
  type ConfirmationMailer,
  type HumanVerifier,
  type SubscriptionThrottle,
  type WishlistContact,
  type WishlistContacts,
} from "./ports.server"
import { createWishlistService } from "./service.server"

const SECRET = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
const NOW = Date.UTC(2026, 6, 29, 12)

function createHarness() {
  let contact: WishlistContact | null = null
  const createConfirmed = vi.fn<WishlistContacts["createConfirmed"]>(async (confirmed) => {
    if (contact) return "conflict"
    contact = {
      email: confirmed.email,
      unsubscribed: false,
      consentId: confirmed.consentId,
      confirmedAt: confirmed.confirmedAt,
    }
    return "created"
  })
  const ensureWishlistSegment = vi.fn<WishlistContacts["ensureWishlistSegment"]>(async () => {
    if (!contact) throw new Error("Contact does not exist")
  })
  const updateConfirmed = vi.fn<WishlistContacts["updateConfirmed"]>(async (confirmed) => {
    if (!contact) throw new Error("Contact does not exist")
    contact = {
      email: confirmed.email,
      unsubscribed: false,
      consentId: confirmed.consentId,
      confirmedAt: confirmed.confirmedAt,
    }
  })
  const contacts: WishlistContacts = {
    async get() {
      return contact
    },
    createConfirmed,
    ensureWishlistSegment,
    updateConfirmed,
  }
  const sentConfirmationUrls: string[] = []
  const mailer: ConfirmationMailer = {
    send: vi.fn(async ({ confirmationUrl }) => {
      sentConfirmationUrls.push(confirmationUrl)
    }),
  }
  const throttle: SubscriptionThrottle = {
    reserve: vi.fn<SubscriptionThrottle["reserve"]>(async () => "allowed"),
    commit: vi.fn(async () => undefined),
    release: vi.fn(async () => undefined),
  }
  const verifier: HumanVerifier = {
    verify: vi.fn(async () => true),
  }
  let now = NOW
  const service = createWishlistService({
    appOrigin: "https://ai-mistakes.org",
    secret: SECRET,
    contacts,
    mailer,
    throttle,
    verifier,
    now: () => now,
  })

  return {
    service,
    contacts,
    mailer,
    throttle,
    createConfirmed,
    ensureWishlistSegment,
    updateConfirmed,
    getContact: () => contact,
    latestConfirmationUrl: () => sentConfirmationUrls.at(-1) ?? null,
    setContact: (next: WishlistContact) => {
      contact = next
    },
    setNow: (next: number) => {
      now = next
    },
  }
}

async function subscribe(harness: ReturnType<typeof createHarness>) {
  return harness.service.subscribe({
    email: "person@example.com",
    clientAddress: "203.0.113.10",
    turnstileToken: "verified",
    hostname: "ai-mistakes.org",
  })
}

function tokenFrom(confirmationUrl: string) {
  const fragment = new URL(confirmationUrl).hash.slice(1)
  const token = new URLSearchParams(fragment).get("token")
  if (!token) throw new Error("Confirmation token is missing")
  return token
}

describe("wishlist service", () => {
  it("creates one contact and repairs membership on an idempotent confirmation", async () => {
    const harness = createHarness()
    await subscribe(harness)
    const confirmationUrl = harness.latestConfirmationUrl()
    if (!confirmationUrl) throw new Error("Confirmation URL is missing")
    const token = tokenFrom(confirmationUrl)

    await expect(harness.service.confirm(token)).resolves.toEqual({ status: "confirmed" })
    await expect(harness.service.confirm(token)).resolves.toEqual({ status: "confirmed" })

    expect(harness.createConfirmed).toHaveBeenCalledTimes(1)
    expect(harness.ensureWishlistSegment).toHaveBeenCalledTimes(1)
    expect(harness.updateConfirmed).not.toHaveBeenCalled()
  })

  it("does not send another email during the cooldown", async () => {
    const harness = createHarness()
    const reserve = vi.mocked(harness.throttle.reserve)
    reserve.mockResolvedValueOnce("allowed").mockResolvedValueOnce("cooldown")

    const first = await subscribe(harness)
    const second = await subscribe(harness)

    expect(first).toEqual({ status: "check-email" })
    expect(harness.latestConfirmationUrl()).toBeTruthy()
    expect(second).toEqual({ status: "check-email" })
    expect(harness.mailer.send).toHaveBeenCalledTimes(1)
  })

  it("repairs an active contact segment without sending another email", async () => {
    const harness = createHarness()
    harness.setContact({
      email: "person@example.com",
      unsubscribed: false,
      consentId: "AAAAAAAAAAAAAAAAAAAAAA",
      confirmedAt: NOW,
    })

    await expect(subscribe(harness)).resolves.toEqual({ status: "check-email" })
    expect(harness.ensureWishlistSegment).toHaveBeenCalledTimes(1)
    expect(harness.throttle.reserve).not.toHaveBeenCalled()
    expect(harness.mailer.send).not.toHaveBeenCalled()
  })

  it("returns a rate limit result without sending when the client limit is reached", async () => {
    const harness = createHarness()
    vi.mocked(harness.throttle.reserve).mockResolvedValue("rate-limit")

    await expect(subscribe(harness)).resolves.toEqual({ status: "rate-limited" })
    expect(harness.mailer.send).not.toHaveBeenCalled()
  })

  it("does not report success while another delivery is pending", async () => {
    const harness = createHarness()
    vi.mocked(harness.throttle.reserve).mockResolvedValue("busy")

    await expect(subscribe(harness)).resolves.toEqual({ status: "retry-later" })
    expect(harness.mailer.send).not.toHaveBeenCalled()
  })

  it("releases the cooldown after an explicit delivery rejection", async () => {
    const harness = createHarness()
    vi.mocked(harness.mailer.send).mockRejectedValue(new ConfirmationDeliveryError("rejected"))

    await expect(subscribe(harness)).rejects.toBeInstanceOf(ConfirmationDeliveryError)
    expect(harness.throttle.release).toHaveBeenCalledTimes(1)
  })

  it("keeps an accepted delivery successful when cooldown promotion fails", async () => {
    const harness = createHarness()
    vi.mocked(harness.throttle.commit).mockRejectedValue(new Error("Redis unavailable"))

    await expect(subscribe(harness)).resolves.toEqual({ status: "check-email" })
    expect(harness.mailer.send).toHaveBeenCalledTimes(1)
  })

  it("keeps the pending reservation after an ambiguous delivery failure", async () => {
    const harness = createHarness()
    vi.mocked(harness.mailer.send).mockRejectedValue(
      new ConfirmationDeliveryError("unknown", "Provider timeout")
    )

    await expect(subscribe(harness)).rejects.toBeInstanceOf(ConfirmationDeliveryError)
    expect(harness.throttle.release).not.toHaveBeenCalled()
  })

  it("does not restore an unsubscribed contact with an old token", async () => {
    const harness = createHarness()
    await subscribe(harness)
    const confirmationUrl = harness.latestConfirmationUrl()
    if (!confirmationUrl) throw new Error("Confirmation URL is missing")
    const token = tokenFrom(confirmationUrl)

    await harness.service.confirm(token)
    const confirmed = harness.getContact()
    if (!confirmed) throw new Error("Contact was not created")
    harness.setContact({ ...confirmed, unsubscribed: true })
    await expect(harness.service.confirm(token)).resolves.toEqual({ status: "inactive" })

    expect(harness.getContact()?.unsubscribed).toBe(true)
    expect(harness.updateConfirmed).not.toHaveBeenCalled()
  })

  it("keeps a re-consent inactive until segment membership succeeds", async () => {
    const harness = createHarness()
    await subscribe(harness)
    const firstConfirmationUrl = harness.latestConfirmationUrl()
    if (!firstConfirmationUrl) throw new Error("Confirmation URL is missing")
    await harness.service.confirm(tokenFrom(firstConfirmationUrl))

    const confirmed = harness.getContact()
    if (!confirmed) throw new Error("Contact was not created")
    harness.setContact({ ...confirmed, unsubscribed: true })
    harness.setNow(NOW + 1_000)

    await subscribe(harness)
    const secondConfirmationUrl = harness.latestConfirmationUrl()
    if (!secondConfirmationUrl) throw new Error("Confirmation URL is missing")
    const secondToken = tokenFrom(secondConfirmationUrl)
    vi.mocked(harness.ensureWishlistSegment).mockRejectedValueOnce(
      new Error("Segment membership failed")
    )

    await expect(harness.service.confirm(secondToken)).rejects.toThrow("Segment membership failed")

    expect(harness.getContact()?.unsubscribed).toBe(true)
    expect(harness.updateConfirmed).not.toHaveBeenCalled()
    expect(harness.ensureWishlistSegment).toHaveBeenCalledTimes(1)

    await expect(harness.service.confirm(secondToken)).resolves.toEqual({
      status: "confirmed",
    })

    expect(harness.updateConfirmed).toHaveBeenCalledTimes(1)
    expect(harness.ensureWishlistSegment).toHaveBeenCalledTimes(2)
    expect(harness.ensureWishlistSegment.mock.invocationCallOrder[1]).toBeLessThan(
      harness.updateConfirmed.mock.invocationCallOrder[0]
    )
  })

  it("ensures segment membership before applying consent after a create conflict", async () => {
    const harness = createHarness()
    await subscribe(harness)
    const confirmationUrl = harness.latestConfirmationUrl()
    if (!confirmationUrl) throw new Error("Confirmation URL is missing")

    harness.createConfirmed.mockImplementationOnce(async () => {
      harness.setContact({
        email: "person@example.com",
        unsubscribed: true,
        consentId: "BBBBBBBBBBBBBBBBBBBBBB",
        confirmedAt: NOW - 1,
      })
      return "conflict"
    })

    await expect(harness.service.confirm(tokenFrom(confirmationUrl))).resolves.toEqual({
      status: "confirmed",
    })

    expect(harness.updateConfirmed).toHaveBeenCalledTimes(1)
    expect(harness.ensureWishlistSegment.mock.invocationCallOrder[0]).toBeLessThan(
      harness.updateConfirmed.mock.invocationCallOrder[0]
    )
  })
})
