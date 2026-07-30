import "@tanstack/react-start/server-only"
import type { HumanVerifier } from "./ports.server"
import { isRecord, TURNSTILE_ACTION } from "./contract"

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
const TURNSTILE_TIMEOUT = 5_000

type TurnstileConfig = {
  secretKey: string
}

export function createTurnstileVerifier(config: TurnstileConfig): HumanVerifier {
  return {
    async verify({ token, hostname }) {
      if (!token) return false

      let response: Response
      try {
        response = await fetch(SITEVERIFY_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            secret: config.secretKey,
            response: token,
          }),
          signal: AbortSignal.timeout(TURNSTILE_TIMEOUT),
        })
      } catch {
        logUnavailable(null)
        return true
      }

      if (!response.ok) {
        if (isUnavailableStatus(response.status)) {
          logUnavailable(response.status)
          return true
        }
        return false
      }

      let result: unknown
      try {
        result = await response.json()
      } catch {
        logUnavailable(response.status)
        return true
      }

      if (!isTurnstileResult(result)) {
        logUnavailable(response.status)
        return true
      }
      if (!result.success) {
        if (result["error-codes"]?.length === 1 && result["error-codes"][0] === "internal-error") {
          logUnavailable(response.status)
          return true
        }
        return false
      }

      return result.hostname === hostname && result.action === TURNSTILE_ACTION
    },
  }
}

function isUnavailableStatus(status: number) {
  return status === 429 || status >= 500
}

function logUnavailable(statusCode: number | null) {
  console.error("wishlist_turnstile_unavailable", {
    reason: "provider_unavailable",
    statusCode,
  })
}

function isTurnstileResult(value: unknown): value is {
  success: boolean
  hostname?: string
  action?: string
  "error-codes"?: string[]
} {
  return (
    isRecord(value) &&
    typeof value.success === "boolean" &&
    (value.hostname === undefined || typeof value.hostname === "string") &&
    (value.action === undefined || typeof value.action === "string") &&
    (value["error-codes"] === undefined ||
      (Array.isArray(value["error-codes"]) &&
        value["error-codes"].every((code) => typeof code === "string")))
  )
}
