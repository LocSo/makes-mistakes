import { useEffect, useRef, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { CheckCircle2, LoaderCircle, MailWarning } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { isConfirmResponse } from "@/features/wishlist/contract"
import { track } from "@/lib/analytics"
import { seoHead } from "@/lib/seo"

const REQUEST_TIMEOUT = 60_000

type ConfirmationState =
  | "loading"
  | "ready"
  | "confirming"
  | "confirmed"
  | "inactive"
  | "invalid"
  | "expired"
  | "unavailable"

export const Route = createFileRoute("/wishlist/confirm")({
  head: () =>
    seoHead({
      title: "Confirm email",
      description: "Confirm your Makes Mistakes launch notification.",
      path: "/wishlist/confirm",
      robots: "noindex,nofollow",
    }),
  headers: () => ({
    "cache-control": "no-store",
    "referrer-policy": "no-referrer",
  }),
  component: WishlistConfirmation,
})

function WishlistConfirmation() {
  const [state, setState] = useState<ConfirmationState>("loading")
  const [token, setToken] = useState<string | null>(null)
  const terminalHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1))
    const confirmationToken = fragment.get("token")
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`)

    if (!confirmationToken) {
      setState("invalid")
      return
    }

    setToken(confirmationToken)
    setState("ready")
  }, [])

  useEffect(() => {
    if (
      state === "confirmed" ||
      state === "inactive" ||
      state === "invalid" ||
      state === "expired"
    ) {
      terminalHeadingRef.current?.focus()
    }
  }, [state])

  async function confirm() {
    if (!token || state === "confirming") return

    setState("confirming")
    try {
      const response = await fetch("/api/wishlist/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      })

      if (response.status === 410) {
        setState("expired")
        return
      }
      if (response.status === 400) {
        setState("invalid")
        return
      }
      if (!response.ok) {
        setState("unavailable")
        return
      }

      const result: unknown = await response.json()
      if (!isConfirmResponse(result)) {
        setState("unavailable")
        return
      }

      if (result.status === "inactive") {
        setState("inactive")
        return
      }

      setState(result.status)
      track("wishlist")
    } catch {
      setState("unavailable")
    }
  }

  return (
    <>
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-2xl flex-1 items-center px-6 py-16">
        <section className="border-gold/20 bg-card/55 w-full rounded-2xl border px-6 py-10 text-center sm:px-10">
          {state === "confirmed" ? (
            <>
              <CheckCircle2 className="text-gold mx-auto size-10" strokeWidth={1.4} aria-hidden />
              <h1
                ref={terminalHeadingRef}
                tabIndex={-1}
                className="font-heading mt-5 text-4xl outline-none"
              >
                Email confirmed.
              </h1>
              <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm leading-relaxed">
                You&apos;re on the launch list. We&apos;ll send one email when the paid version is
                ready.
              </p>
            </>
          ) : state === "inactive" || state === "invalid" || state === "expired" ? (
            <>
              <MailWarning
                className="text-muted-foreground mx-auto size-10"
                strokeWidth={1.4}
                aria-hidden
              />
              <h1
                ref={terminalHeadingRef}
                tabIndex={-1}
                className="font-heading mt-5 text-4xl outline-none"
              >
                {state === "inactive"
                  ? "This link no longer applies."
                  : state === "expired"
                    ? "This link expired."
                    : "This link is not valid."}
              </h1>
              <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm leading-relaxed">
                {state === "inactive"
                  ? "A fresh confirmation can be requested once the seven-day resend window has passed."
                  : "Return to the homepage if you’d like to request a new confirmation link."}
              </p>
              <a
                href="/#wishlist"
                className="border-gold/40 text-gold-lit hover:border-gold hover:bg-gold/10 mt-7 inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-semibold transition-colors"
              >
                Return to the wishlist
              </a>
            </>
          ) : (
            <>
              <p className="text-gold/70 text-[11px] tracking-[0.24em] uppercase">Makes Mistakes</p>
              <h1 className="font-heading mt-4 text-4xl">Confirm your email.</h1>
              <p className="text-muted-foreground mx-auto mt-3 max-w-md text-sm leading-relaxed">
                Confirm that you want one notification when the paid version is ready. No
                newsletter.
              </p>

              {state === "loading" ? (
                <LoaderCircle
                  className="text-gold mx-auto mt-7 size-6 animate-spin"
                  aria-label="Reading confirmation link"
                />
              ) : (
                <button
                  type="button"
                  onClick={confirm}
                  disabled={state === "confirming"}
                  className="bg-gold text-primary-foreground hover:bg-gold-lit mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors disabled:cursor-default disabled:opacity-70"
                >
                  {state === "confirming" && (
                    <LoaderCircle className="size-4 animate-spin" aria-hidden />
                  )}
                  {state === "confirming" ? "Confirming" : "Confirm email"}
                </button>
              )}

              {state === "unavailable" && (
                <p className="mt-4 text-xs text-red-400/85" aria-live="polite">
                  Confirmation is temporarily unavailable. Please try again.
                </p>
              )}
            </>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
