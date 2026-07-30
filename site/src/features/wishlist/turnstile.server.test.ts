import { afterEach, describe, expect, it, vi } from "vitest"
import { TURNSTILE_ACTION } from "./contract"
import { createTurnstileVerifier } from "./turnstile.server"

const HOSTNAME = "ai-mistakes.org"

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("Turnstile verification", () => {
  it("rejects a missing token without calling the provider", async () => {
    const fetch = vi.fn()
    vi.stubGlobal("fetch", fetch)

    await expect(verify("")).resolves.toBe(false)
    expect(fetch).not.toHaveBeenCalled()
  })

  it("accepts the signup when the provider is unavailable", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined)
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network unavailable")))

    await expect(verify("token")).resolves.toBe(true)
    expect(log).toHaveBeenCalledWith("wishlist_turnstile_unavailable", {
      reason: "provider_unavailable",
      statusCode: null,
    })
  })

  it("accepts non-successful or malformed provider responses", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined)
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(Response.json({ unexpected: true }))
    vi.stubGlobal("fetch", fetch)

    await expect(verify("token")).resolves.toBe(true)
    await expect(verify("token")).resolves.toBe(true)
    expect(log).toHaveBeenCalledTimes(2)
  })

  it("fails closed for provider 4xx responses except rate limiting", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined)
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 429 }))
    vi.stubGlobal("fetch", fetch)

    await expect(verify("misconfigured")).resolves.toBe(false)
    await expect(verify("rate-limited")).resolves.toBe(true)
    expect(log).toHaveBeenCalledOnce()
  })

  it("rejects explicit failures and mismatched verification metadata", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ success: false }))
      .mockResolvedValueOnce(
        Response.json({
          success: true,
          hostname: "spoofed.example",
          action: TURNSTILE_ACTION,
        })
      )
      .mockResolvedValueOnce(
        Response.json({
          success: true,
          hostname: HOSTNAME,
          action: TURNSTILE_ACTION,
        })
      )
    vi.stubGlobal("fetch", fetch)

    await expect(verify("invalid")).resolves.toBe(false)
    await expect(verify("wrong-hostname")).resolves.toBe(false)
    await expect(verify("valid")).resolves.toBe(true)
  })

  it("accepts an explicit Cloudflare internal error", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined)
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          success: false,
          "error-codes": ["internal-error"],
        })
      )
    )

    await expect(verify("token")).resolves.toBe(true)
    expect(log).toHaveBeenCalledOnce()
  })
})

function verify(token: string) {
  return createTurnstileVerifier({ secretKey: "secret" }).verify({
    token,
    hostname: HOSTNAME,
  })
}
