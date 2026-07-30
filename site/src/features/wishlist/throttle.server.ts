import "@tanstack/react-start/server-only"
import { Redis } from "@upstash/redis"
import type { SubscriptionThrottle } from "./ports.server"

const COOLDOWN_SECONDS = 7 * 24 * 60 * 60
const PENDING_SECONDS = 2 * 60
const CLIENT_WINDOW_SECONDS = 10 * 60
const CLIENT_LIMIT = 10
const REDIS_TIMEOUT = 5_000
const COMMIT_ATTEMPTS = 3

const RESERVE_SCRIPT = `
  local pending = "pending:" .. ARGV[1]
  local existing = redis.call("GET", KEYS[1])
  if existing then
    if string.sub(existing, 1, 10) == "delivered:" then
      return 0
    end
    if existing == pending then
      return 1
    end
    return -2
  end

  local has_client = ARGV[5] == "1"
  local now_ms = 0
  if has_client then
    local now = redis.call("TIME")
    now_ms = (tonumber(now[1]) * 1000) + math.floor(tonumber(now[2]) / 1000)
    redis.call("ZREMRANGEBYSCORE", KEYS[2], "-inf", now_ms - tonumber(ARGV[4]))
    if redis.call("ZCARD", KEYS[2]) >= tonumber(ARGV[3]) then
      return -1
    end
  end

  local reserved = redis.call("SET", KEYS[1], pending, "EX", ARGV[2], "NX")
  if not reserved then
    return -2
  end

  if has_client then
    redis.call("ZADD", KEYS[2], now_ms, ARGV[1])
    redis.call("PEXPIRE", KEYS[2], ARGV[4])
  end

  return 1
`

const COMMIT_SCRIPT = `
  local pending = "pending:" .. ARGV[1]
  local delivered = "delivered:" .. ARGV[1]
  local existing = redis.call("GET", KEYS[1])

  if existing == delivered then
    return 1
  end

  if existing == pending then
    redis.call("SET", KEYS[1], delivered, "EX", ARGV[2], "XX")
    return 1
  end

  return 0
`

const RELEASE_SCRIPT = `
  if redis.call("GET", KEYS[1]) == "pending:" .. ARGV[1] then
    redis.call("DEL", KEYS[1])
    if ARGV[2] == "1" then
      redis.call("ZREM", KEYS[2], ARGV[1])
      if redis.call("ZCARD", KEYS[2]) == 0 then
        redis.call("DEL", KEYS[2])
      end
    end
    return 1
  end

  return 0
`

type RedisConfig = {
  url: string
  token: string
}

export function createUpstashThrottle(config: RedisConfig): SubscriptionThrottle {
  return {
    async reserve({ emailFingerprint, clientFingerprint, consentId }) {
      const cooldownKey = `wishlist:cooldown:v2:${emailFingerprint}`
      const clientKey = clientFingerprint
        ? `wishlist:client:v3:${clientFingerprint}`
        : "wishlist:client:v3:disabled"
      let result: number
      try {
        result = await redis(config).eval<string[], number>(
          RESERVE_SCRIPT,
          [cooldownKey, clientKey],
          [
            consentId,
            String(PENDING_SECONDS),
            String(CLIENT_LIMIT),
            String(CLIENT_WINDOW_SECONDS * 1_000),
            clientFingerprint ? "1" : "0",
          ]
        )
        if (result !== 1 && result !== 0 && result !== -1 && result !== -2) {
          throw new Error("Unexpected Redis reservation result")
        }
      } catch (error) {
        try {
          await releaseReservation(
            config,
            cooldownKey,
            clientKey,
            consentId,
            clientFingerprint !== null
          )
        } catch {
          console.error("wishlist_throttle_cleanup_failed", {
            reason: "ambiguous_reservation",
          })
        }
        throw error
      }

      if (result === 1) return "allowed"
      if (result === 0) return "cooldown"
      if (result === -2) return "busy"
      return "rate-limit"
    },

    async commit({ emailFingerprint, consentId }) {
      await commitReservation(config, `wishlist:cooldown:v2:${emailFingerprint}`, consentId)
    },

    async release({ emailFingerprint, clientFingerprint, consentId }) {
      await releaseReservation(
        config,
        `wishlist:cooldown:v2:${emailFingerprint}`,
        clientFingerprint
          ? `wishlist:client:v3:${clientFingerprint}`
          : "wishlist:client:v3:disabled",
        consentId,
        clientFingerprint !== null
      )
    },
  }
}

async function releaseReservation(
  config: RedisConfig,
  cooldownKey: string,
  clientKey: string,
  consentId: string,
  hasClient = true
) {
  const result = await redis(config).eval<string[], number>(
    RELEASE_SCRIPT,
    [cooldownKey, clientKey],
    [consentId, hasClient ? "1" : "0"]
  )
  if (result !== 0 && result !== 1) throw new Error("Unexpected Redis release result")
}

async function commitReservation(config: RedisConfig, cooldownKey: string, consentId: string) {
  let lastError: unknown

  for (let attempt = 0; attempt < COMMIT_ATTEMPTS; attempt += 1) {
    try {
      const result = await redis(config).eval<string[], number>(
        COMMIT_SCRIPT,
        [cooldownKey],
        [consentId, String(COOLDOWN_SECONDS)]
      )
      if (result !== 1) throw new Error("Redis reservation is no longer pending")
      return
    } catch (error) {
      lastError = error
    }
  }

  throw lastError
}

function redis(config: RedisConfig) {
  return new Redis({
    ...config,
    signal: AbortSignal.timeout(REDIS_TIMEOUT),
    enableAutoPipelining: false,
  })
}
