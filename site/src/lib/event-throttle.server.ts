import "@tanstack/react-start/server-only"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

/**
 * Caps how many analytics events one address can push through the /stats proxy.
 *
 * Redis rather than process memory because each serverless instance has its own; a counter
 * in a module would cap nothing. `ephemeralCache` keeps an already-blocked address in
 * memory so a flood does not spend a Redis command per request.
 */
const WINDOW = "1 h"
const MAX_EVENTS_PER_WINDOW = 500

function client() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  // Absent in development. No Redis means no cap, not a broken site.
  if (!url || !token) return null

  return new Ratelimit({
    redis: new Redis({
      url,
      token,
      enableAutoPipelining: false,
    }),
    limiter: Ratelimit.slidingWindow(MAX_EVENTS_PER_WINDOW, WINDOW),
    analytics: false,
    ephemeralCache: new Map(),
    prefix: "mistakes:events:v1",
  })
}

const limiter = client()

// `(?<!cu)` spares CUBOT, a real Android handset that an unanchored `bot` would delete.
const botAgents = /(?<!cu)bot|crawler|spider|crawling|headless|phantomjs|slurp|curl|wget|python-/i

/** FNV-1a. A collision only merges two visitors into one bucket, which costs nothing here. */
function fingerprint(value: string) {
  let hash = 0x811c9dc5

  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }

  return (hash >>> 0).toString(36)
}

export async function shouldDropEvent(request: Request) {
  const agent = request.headers.get("user-agent") ?? ""
  if (botAgents.test(agent)) return true
  if (!limiter) return false

  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

  // Address and agent together: a NAT or carrier CGNAT puts many readers behind one address.
  try {
    const { success } = await limiter.limit(fingerprint(`${address}|${agent}`))
    return !success
  } catch (error) {
    console.error("event_throttle_unavailable", error)
    return false
  }
}
