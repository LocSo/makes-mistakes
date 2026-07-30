import { afterEach, describe, expect, it, vi } from "vitest"
import { createResendAdapters } from "./resend.server"

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function createAdapters() {
  return createResendAdapters({
    apiKey: "re_send",
    contactsApiKey: "re_contacts",
    from: "Makes Mistakes <wishlist@updates.ai-mistakes.org>",
    replyTo: "hello@ai-mistakes.org",
    segmentId: "segment-id",
  })
}

describe("Resend contact adapter", () => {
  it("reads primitive custom properties returned by the Contacts API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          object: "contact",
          id: "contact-id",
          email: "person@example.com",
          unsubscribed: true,
          properties: {
            consent_id: "AAAAAAAAAAAAAAAAAAAAAA",
            confirmed_at: "2026-07-29T12:00:00.000Z",
          },
        })
      )
    )

    await expect(createAdapters().contacts.get("person@example.com")).resolves.toEqual({
      email: "person@example.com",
      unsubscribed: true,
      consentId: "AAAAAAAAAAAAAAAAAAAAAA",
      confirmedAt: Date.UTC(2026, 6, 29, 12),
    })
  })

  it("creates a confirmed contact in the configured segment", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        object: "contact",
        id: "contact-id",
      })
    )
    vi.stubGlobal("fetch", fetchMock)

    await expect(
      createAdapters().contacts.createConfirmed({
        email: "person@example.com",
        consentId: "AAAAAAAAAAAAAAAAAAAAAA",
        consentVersion: "2026-07-29",
        consentSource: "website",
        confirmedAt: Date.UTC(2026, 6, 29, 12),
      })
    ).resolves.toBe("created")

    const request = fetchMock.mock.calls[0]?.[1]
    expect(JSON.parse(String(request?.body))).toEqual({
      email: "person@example.com",
      unsubscribed: false,
      properties: {
        confirmed_at: "2026-07-29T12:00:00.000Z",
        consent_version: "2026-07-29",
        consent_source: "website",
        consent_id: "AAAAAAAAAAAAAAAAAAAAAA",
      },
      segments: [{ id: "segment-id" }],
    })
  })
})

describe("Resend confirmation mailer", () => {
  const message = {
    email: "person@example.com",
    confirmationUrl: "https://ai-mistakes.org/wishlist/confirm#token=test",
    consentId: "AAAAAAAAAAAAAAAAAAAAAA",
  }

  it("accepts a successful response without parsing its unused body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 200 })))

    await expect(createAdapters().mailer.send(message)).resolves.toBeUndefined()
  })

  it("retries an unknown outcome with the same idempotency key and payload", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("Response lost"))
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)

    await expect(createAdapters().mailer.send(message)).resolves.toBeUndefined()

    expect(fetchMock).toHaveBeenCalledTimes(2)
    const firstRequest = fetchMock.mock.calls[0]?.[1]
    const secondRequest = fetchMock.mock.calls[1]?.[1]
    expect(firstRequest?.headers.get("idempotency-key")).toBe(
      secondRequest?.headers.get("idempotency-key")
    )
    expect(firstRequest?.body).toBe(secondRequest?.body)
  })

  it("classifies a validation response as a definitive rejection", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json(
          {
            name: "validation_error",
            message: "Invalid request",
          },
          { status: 422 }
        )
      )
    )

    await expect(createAdapters().mailer.send(message)).rejects.toMatchObject({
      deliveryState: "rejected",
      operation: "send_confirmation",
      statusCode: 422,
    })
  })
})
