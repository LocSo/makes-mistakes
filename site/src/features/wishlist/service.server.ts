import "@tanstack/react-start/server-only"
import {
  ConfirmationDeliveryError,
  decideConfirmation,
  type ConfirmedContact,
  type WishlistDependencies,
} from "./ports.server"
import {
  createConfirmationToken,
  fingerprintClient,
  fingerprintEmail,
  readConfirmationToken,
  type ConfirmationToken,
} from "./token.server"

export function createWishlistService(dependencies: WishlistDependencies) {
  return {
    async subscribe({
      email,
      clientAddress,
      turnstileToken,
      hostname,
    }: {
      email: string
      clientAddress: string | null
      turnstileToken: string
      hostname: string
    }) {
      if (!(await dependencies.verifier.verify({ token: turnstileToken, hostname }))) {
        return { status: "verification-failed" as const }
      }

      const existingContact = await dependencies.contacts.get(email)
      if (existingContact && !existingContact.unsubscribed && existingContact.consentId) {
        await dependencies.contacts.ensureWishlistSegment(email)
        return { status: "check-email" as const }
      }

      const now = dependencies.now()
      const { token, payload } = await createConfirmationToken({
        email,
        secret: dependencies.secret,
        now,
      })
      const [emailFingerprint, clientFingerprint] = await Promise.all([
        fingerprintEmail(email, dependencies.secret),
        clientAddress
          ? fingerprintClient(clientAddress, dependencies.secret)
          : Promise.resolve(null),
      ])
      const reservation = await dependencies.throttle.reserve({
        emailFingerprint,
        clientFingerprint,
        consentId: payload.consentId,
      })

      if (reservation === "cooldown") return { status: "check-email" as const }
      if (reservation === "busy") return { status: "retry-later" as const }
      if (reservation === "rate-limit") return { status: "rate-limited" as const }

      const confirmationUrl = `${dependencies.appOrigin}/wishlist/confirm#token=${token}`

      try {
        await dependencies.mailer.send({
          email,
          confirmationUrl,
          consentId: payload.consentId,
        })
      } catch (error) {
        if (error instanceof ConfirmationDeliveryError && error.deliveryState === "rejected") {
          try {
            await dependencies.throttle.release({
              emailFingerprint,
              clientFingerprint,
              consentId: payload.consentId,
            })
          } catch {
            console.error("wishlist_throttle_cleanup_failed", {
              reason: "delivery_rejected",
            })
          }
        }
        throw error
      }

      try {
        await dependencies.throttle.commit({
          emailFingerprint,
          consentId: payload.consentId,
        })
      } catch {
        console.error("wishlist_throttle_commit_failed", {
          reason: "delivery_accepted",
        })
      }

      return { status: "check-email" as const }
    },

    async confirm(token: string) {
      const payload = await readConfirmationToken({
        token,
        secret: dependencies.secret,
        now: dependencies.now(),
      })
      const status = await applyConfirmation(dependencies, payload)
      return { status }
    },
  }
}

async function applyConfirmation(dependencies: WishlistDependencies, token: ConfirmationToken) {
  const contact = await dependencies.contacts.get(token.email)
  const decision = decideConfirmation(contact, token)

  if (decision === "ignore-stale-or-unsubscribed-replay") return "inactive" as const
  if (decision === "repair-segment") {
    await dependencies.contacts.ensureWishlistSegment(token.email)
    return "confirmed" as const
  }

  const confirmedContact: ConfirmedContact = {
    email: token.email,
    consentId: token.consentId,
    consentVersion: token.consentVersion,
    consentSource: "website",
    confirmedAt: dependencies.now(),
  }

  if (decision === "apply-new-consent") {
    await applyNewConsent(dependencies, confirmedContact)
    return "confirmed" as const
  }

  const created = await dependencies.contacts.createConfirmed(confirmedContact)
  if (created === "created") return "confirmed" as const

  const concurrentContact = await dependencies.contacts.get(token.email)
  const concurrentDecision = decideConfirmation(concurrentContact, token)

  if (concurrentDecision === "repair-segment") {
    await dependencies.contacts.ensureWishlistSegment(token.email)
    return "confirmed" as const
  }
  if (concurrentDecision === "apply-new-consent") {
    await applyNewConsent(dependencies, confirmedContact)
    return "confirmed" as const
  }
  if (concurrentDecision === "ignore-stale-or-unsubscribed-replay") return "inactive" as const

  throw new Error("Contact conflict could not be resolved")
}

async function applyNewConsent(
  dependencies: WishlistDependencies,
  confirmedContact: ConfirmedContact
) {
  await dependencies.contacts.ensureWishlistSegment(confirmedContact.email)
  await dependencies.contacts.updateConfirmed(confirmedContact)
}
