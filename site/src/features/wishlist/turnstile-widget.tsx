import { useEffect, useRef } from "react"
import { turnstileAppearance, turnstileSiteKey } from "./client-config"
import { TURNSTILE_ACTION } from "./contract"

const TURNSTILE_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
const TURNSTILE_SCRIPT_TIMEOUT = 8_000

type TurnstileWidgetProps = {
  resetKey: number
  onToken: (token: string | null) => void
  onUnavailable: (unavailable: boolean) => void
}

let scriptLoad: Promise<void> | null = null

export function TurnstileWidget({ resetKey, onToken, onUnavailable }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onTokenRef = useRef(onToken)
  const onUnavailableRef = useRef(onUnavailable)
  onTokenRef.current = onToken
  onUnavailableRef.current = onUnavailable

  useEffect(() => {
    const container = containerRef.current
    const siteKey = turnstileSiteKey
    if (!container || !siteKey) return

    let widgetId: string | null = null
    let cancelled = false

    const render = () => {
      if (cancelled || !window.turnstile || widgetId) return
      try {
        widgetId = window.turnstile.render(container, {
          sitekey: siteKey,
          action: TURNSTILE_ACTION,
          appearance: turnstileAppearance,
          size: "flexible",
          callback: (token) => {
            if (cancelled) return
            onUnavailableRef.current(false)
            onTokenRef.current(token)
          },
          "expired-callback": () => {
            if (!cancelled) onTokenRef.current(null)
          },
          "error-callback": () => {
            if (cancelled) return
            onTokenRef.current(null)
            onUnavailableRef.current(true)
          },
        })
        onUnavailableRef.current(false)
      } catch {
        if (cancelled) return
        onTokenRef.current(null)
        onUnavailableRef.current(true)
      }
    }

    void loadTurnstileScript().then(render, () => {
      if (!cancelled) onUnavailableRef.current(true)
    })

    return () => {
      cancelled = true
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
      onTokenRef.current(null)
    }
  }, [resetKey])

  return <div ref={containerRef} className="min-h-0 w-full" aria-label="Human verification" />
}

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve()
  if (scriptLoad) return scriptLoad

  scriptLoad = new Promise<void>((resolve, reject) => {
    document
      .querySelector<HTMLScriptElement>(
        'script[src^="https://challenges.cloudflare.com/turnstile/"]'
      )
      ?.remove()

    const script = document.createElement("script")
    script.src = TURNSTILE_SCRIPT_URL
    script.async = true
    script.defer = true

    const finish = (result: "loaded" | "failed" | "timed-out") => {
      window.clearTimeout(timeout)
      script.removeEventListener("load", handleLoad)
      script.removeEventListener("error", handleError)

      if (result === "loaded" && window.turnstile) resolve()
      else {
        script.remove()
        reject(new Error(`Turnstile script ${result}`))
      }
    }
    const handleLoad = () => finish("loaded")
    const handleError = () => finish("failed")
    const timeout = window.setTimeout(() => finish("timed-out"), TURNSTILE_SCRIPT_TIMEOUT)

    script.addEventListener("load", handleLoad, { once: true })
    script.addEventListener("error", handleError, { once: true })
    document.head.append(script)
  }).catch((error: unknown) => {
    scriptLoad = null
    throw error
  })

  return scriptLoad
}
