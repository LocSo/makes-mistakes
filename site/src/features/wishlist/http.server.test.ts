import { describe, expect, it } from "vitest"
import { getValidatedRequestHostname, methodNotAllowedResponse } from "./http.server"

describe("wishlist request origin", () => {
  it("accepts a strict production or direct request match", () => {
    const request = new Request("https://ai-mistakes.org/api/wishlist/subscribe", {
      headers: { origin: "https://ai-mistakes.org" },
    })

    expect(
      getValidatedRequestHostname(request, new URL(request.url).origin, "https://ai-mistakes.org")
    ).toBe("ai-mistakes.org")
  })

  it("rejects a mismatched request origin or browser Origin header", () => {
    const wrongUrl = new Request("https://spoofed.example/api/wishlist/subscribe", {
      headers: { origin: "https://ai-mistakes.org" },
    })
    const wrongOrigin = new Request("https://ai-mistakes.org/api/wishlist/subscribe", {
      headers: { origin: "https://spoofed.example" },
    })

    expect(
      getValidatedRequestHostname(wrongUrl, new URL(wrongUrl.url).origin, "https://ai-mistakes.org")
    ).toBeNull()
    expect(
      getValidatedRequestHostname(
        wrongOrigin,
        new URL(wrongOrigin.url).origin,
        "https://ai-mistakes.org"
      )
    ).toBeNull()
  })

  it("accepts a trusted development proxy origin reconstructed from forwarded protocol", () => {
    const request = new Request("http://makes-mistakes.localhost/api/wishlist/subscribe", {
      headers: { origin: "https://makes-mistakes.localhost" },
    })

    expect(
      getValidatedRequestHostname(
        request,
        "https://makes-mistakes.localhost",
        "https://makes-mistakes.localhost"
      )
    ).toBe("makes-mistakes.localhost")
  })
})

describe("wishlist unsupported methods", () => {
  it("returns a non-cacheable JSON 405 response that advertises POST", async () => {
    const response = methodNotAllowedResponse()

    expect(response.status).toBe(405)
    expect(response.headers.get("allow")).toBe("POST")
    expect(response.headers.get("cache-control")).toBe("no-store")
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8")
    await expect(response.json()).resolves.toEqual({ error: "method_not_allowed" })
  })
})
