import { describe, expect, it } from "vitest"
import {
  createConfirmationToken,
  ExpiredConfirmationTokenError,
  InvalidConfirmationTokenError,
  readConfirmationToken,
} from "./token.server"

const SECRET = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
const NOW = Date.UTC(2026, 6, 29, 12)
const TOKEN_TTL = 7 * 24 * 60 * 60 * 1_000

describe("confirmation tokens", () => {
  it("round-trips an authenticated payload", async () => {
    const created = await createConfirmationToken({
      email: "person@example.com",
      secret: SECRET,
      now: NOW,
    })

    await expect(
      readConfirmationToken({ token: created.token, secret: SECRET, now: NOW + 1 })
    ).resolves.toEqual(created.payload)
  })

  it("rejects a tampered token", async () => {
    const created = await createConfirmationToken({
      email: "person@example.com",
      secret: SECRET,
      now: NOW,
    })
    const midpoint = Math.floor(created.token.length / 2)
    const replacement = created.token[midpoint] === "A" ? "B" : "A"
    const tampered = `${created.token.slice(0, midpoint)}${replacement}${created.token.slice(midpoint + 1)}`

    await expect(
      readConfirmationToken({ token: tampered, secret: SECRET, now: NOW })
    ).rejects.toBeInstanceOf(InvalidConfirmationTokenError)
  })

  it("does not classify an invalid application secret as an invalid token", async () => {
    const created = await createConfirmationToken({
      email: "person@example.com",
      secret: SECRET,
      now: NOW,
    })

    const reading = readConfirmationToken({
      token: created.token,
      secret: "not-valid!",
      now: NOW,
    })

    await expect(reading).rejects.toThrow("WISHLIST_SECRET must be valid base64url")
    await expect(reading).rejects.not.toBeInstanceOf(InvalidConfirmationTokenError)
  })

  it("rejects an expired token", async () => {
    const created = await createConfirmationToken({
      email: "person@example.com",
      secret: SECRET,
      now: NOW,
    })

    await expect(
      readConfirmationToken({
        token: created.token,
        secret: SECRET,
        now: NOW + TOKEN_TTL,
      })
    ).rejects.toBeInstanceOf(ExpiredConfirmationTokenError)
  })
})
