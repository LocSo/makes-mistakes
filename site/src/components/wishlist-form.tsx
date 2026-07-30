import { useCallback, useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowRight, LoaderCircle, MailCheck } from "lucide-react"
import { turnstileSiteKey } from "@/features/wishlist/client-config"
import { isSubscribeResponse } from "@/features/wishlist/contract"

type SubmissionState = "idle" | "sending" | "done"
type Feedback =
  | "verification"
  | "verification-unavailable"
  | "rate-limited"
  | "unavailable"
  | "error"
type TurnstileComponent = (typeof import("@/features/wishlist/turnstile-widget"))["TurnstileWidget"]
type FeedbackState = {
  message: Feedback | null
  visible: boolean
}

const REQUEST_TIMEOUT = 60_000
const FEEDBACK_MESSAGES: Record<Feedback, string> = {
  verification: "Complete the verification to continue.",
  "verification-unavailable": "Verification couldn't load.",
  "rate-limited": "Too many attempts. Please try again in 10 minutes.",
  unavailable: "Email signup is temporarily unavailable. Please try again later.",
  error: "That didn't go through. Please check the address and try again.",
}

export function WishlistForm() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle")
  const [feedback, setFeedback] = useState<FeedbackState>({ message: null, visible: false })
  const [email, setEmail] = useState("")
  const [turnstileActive, setTurnstileActive] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)
  const [TurnstileWidget, setTurnstileWidget] = useState<TurnstileComponent | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const pendingSubmitRef = useRef(false)
  const successRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (submissionState === "done") successRef.current?.focus()
  }, [submissionState])

  useEffect(() => {
    if (!turnstileToken || !pendingSubmitRef.current) return
    pendingSubmitRef.current = false
    formRef.current?.requestSubmit()
  }, [turnstileToken])

  const showFeedback = useCallback((message: Feedback) => {
    setFeedback({ message, visible: true })
  }, [])

  const receiveTurnstileToken = useCallback((token: string | null) => {
    setTurnstileToken(token)
    if (token) {
      setFeedback((current) =>
        current.message === "verification" || current.message === "verification-unavailable"
          ? { ...current, visible: false }
          : current
      )
    }
  }, [])

  const handleTurnstileUnavailable = useCallback(
    (unavailable: boolean) => {
      if (unavailable) showFeedback("verification-unavailable")
    },
    [showFeedback]
  )

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileActive || TurnstileWidget) return

    let cancelled = false
    void import("@/features/wishlist/turnstile-widget").then(
      (module) => {
        if (!cancelled) setTurnstileWidget(() => module.TurnstileWidget)
      },
      () => {
        if (!cancelled) handleTurnstileUnavailable(true)
      }
    )

    return () => {
      cancelled = true
    }
  }, [handleTurnstileUnavailable, turnstileActive, turnstileResetKey, TurnstileWidget])

  const retryTurnstile = useCallback(() => {
    setTurnstileWidget(null)
    setTurnstileResetKey((current) => current + 1)
    showFeedback("verification")
  }, [showFeedback])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submissionState === "sending") return

    if (turnstileSiteKey && !turnstileToken) {
      pendingSubmitRef.current = true
      setTurnstileActive(true)
      if (feedback.message === "verification-unavailable") {
        retryTurnstile()
      } else {
        showFeedback("verification")
      }
      return
    }

    const data = new FormData(event.currentTarget)
    const website = String(data.get("website") ?? "")
    let succeeded = false

    setSubmissionState("sending")
    try {
      const response = await fetch("/api/wishlist/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, website, turnstileToken: turnstileToken ?? "" }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      })

      if (response.status === 403) {
        showFeedback(turnstileSiteKey ? "verification" : "error")
        return
      }
      if (response.status === 429) {
        showFeedback("rate-limited")
        return
      }
      if (response.status === 503) {
        showFeedback("unavailable")
        return
      }
      if (!response.ok) {
        showFeedback("error")
        return
      }

      const result: unknown = await response.json()
      if (!isSubscribeResponse(result)) {
        showFeedback("error")
        return
      }

      succeeded = true
      setSubmissionState("done")
      setEmail("")
    } catch {
      showFeedback("error")
    } finally {
      if (!succeeded) {
        setSubmissionState("idle")
        setTurnstileToken(null)
        setTurnstileResetKey((current) => current + 1)
      }
    }
  }

  if (submissionState === "done") {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="border-gold/40 bg-gold/8 flex items-start gap-3 rounded-2xl border px-5 py-4"
      >
        <MailCheck className="text-gold mt-0.5 size-5 flex-none" aria-hidden />
        <div>
          <p className="text-gold-lit text-sm font-semibold">Request received.</p>
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            If a confirmation email arrives, follow its link to join the launch list.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={submit} className="relative flex w-full max-w-lg flex-col gap-2">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <input
          type="email"
          name="email_address"
          required
          value={email}
          onFocus={() => setTurnstileActive(true)}
          onChange={(event) => {
            pendingSubmitRef.current = false
            setEmail(event.target.value)
            setTurnstileActive(true)
            setFeedback((current) => (current.visible ? { ...current, visible: false } : current))
          }}
          disabled={submissionState === "sending"}
          placeholder="you@example.com"
          aria-label="Email address"
          className="border-gold/30 focus:border-gold/70 placeholder:text-muted-foreground/60 h-11 min-w-0 flex-1 rounded-full border bg-black/40 px-5 text-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-70"
        />

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />

        <button
          type="submit"
          disabled={submissionState === "sending"}
          className="bg-gold text-primary-foreground hover:bg-gold-lit inline-flex h-11 flex-none items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors disabled:cursor-default disabled:opacity-70"
        >
          {submissionState === "sending" ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              Sending
            </>
          ) : (
            <>
              Join the wishlist
              <ArrowRight className="size-3.5" aria-hidden />
            </>
          )}
        </button>
      </div>

      <div className="w-full">
        {TurnstileWidget && turnstileActive && (
          <TurnstileWidget
            resetKey={turnstileResetKey}
            onToken={receiveTurnstileToken}
            onUnavailable={handleTurnstileUnavailable}
          />
        )}

        <div className="h-8 overflow-hidden ps-5 text-xs leading-4" aria-live="polite" aria-atomic>
          <p
            aria-hidden={!feedback.visible}
            className={`text-red-400/85 transition-[opacity,transform] duration-200 ${
              feedback.visible ? "translate-y-0 opacity-100" : "-translate-y-0.5 opacity-0"
            }`}
          >
            {feedback.message ? FEEDBACK_MESSAGES[feedback.message] : ""}
            {feedback.message === "verification-unavailable" && (
              <>
                {" "}
                <button
                  type="button"
                  className="underline underline-offset-2"
                  onClick={retryTurnstile}
                >
                  Retry
                </button>
                .
              </>
            )}
          </p>
        </div>
      </div>
    </form>
  )
}
