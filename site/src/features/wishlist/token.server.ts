import "@tanstack/react-start/server-only"
import { CONSENT_VERSION, isRecord } from "./contract"

const TOKEN_VERSION = 1
const TOKEN_PURPOSE = "wishlist-confirmation"
const TOKEN_TTL = 7 * 24 * 60 * 60 * 1_000
const TOKEN_PREFIX = "v1"
const TOKEN_AAD = new TextEncoder().encode("wishlist-confirmation:v1")
const HKDF_SALT = new TextEncoder().encode("makes-mistakes:wishlist:v1")
const TOKEN_KEY_INFO = new TextEncoder().encode("token-encryption")
const FINGERPRINT_KEY_INFO = new TextEncoder().encode("email-fingerprint")
const CLIENT_FINGERPRINT_KEY_INFO = new TextEncoder().encode("client-fingerprint")
const TOKEN_PATTERN = /^v1\.([A-Za-z0-9_-]+)$/
const CONSENT_ID_PATTERN = /^[A-Za-z0-9_-]{22}$/
const MAX_TOKEN_LENGTH = 1_024
const MIN_ENCRYPTED_BYTES = 12 + 16 + 2

export type ConfirmationToken = {
  tokenVersion: 1
  purpose: "wishlist-confirmation"
  email: string
  consentId: string
  consentVersion: string
  issuedAt: number
  expiresAt: number
}

export class InvalidConfirmationTokenError extends Error {}
export class ExpiredConfirmationTokenError extends Error {}

export async function createConfirmationToken({
  email,
  secret,
  now = Date.now(),
}: {
  email: string
  secret: string
  now?: number
}) {
  const key = await deriveTokenKey(secret)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const payload: ConfirmationToken = {
    tokenVersion: TOKEN_VERSION,
    purpose: TOKEN_PURPOSE,
    email,
    consentId: encodeBase64Url(crypto.getRandomValues(new Uint8Array(16))),
    consentVersion: CONSENT_VERSION,
    issuedAt: now,
    expiresAt: now + TOKEN_TTL,
  }
  const plaintext = new TextEncoder().encode(JSON.stringify(payload))
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: TOKEN_AAD },
    key,
    plaintext
  )
  const encrypted = new Uint8Array(iv.length + ciphertext.byteLength)
  encrypted.set(iv)
  encrypted.set(new Uint8Array(ciphertext), iv.length)

  return {
    token: `${TOKEN_PREFIX}.${encodeBase64Url(encrypted)}`,
    payload,
  }
}

export async function readConfirmationToken({
  token,
  secret,
  now = Date.now(),
}: {
  token: string
  secret: string
  now?: number
}) {
  if (token.length > MAX_TOKEN_LENGTH) throw new InvalidConfirmationTokenError()

  const match = TOKEN_PATTERN.exec(token)
  if (!match) throw new InvalidConfirmationTokenError()

  const encrypted = decodeBase64Url(match[1])
  if (encrypted.byteLength < MIN_ENCRYPTED_BYTES) throw new InvalidConfirmationTokenError()

  const iv = encrypted.slice(0, 12)
  const ciphertext = encrypted.slice(12)
  const key = await deriveTokenKey(secret)

  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, additionalData: TOKEN_AAD },
      key,
      ciphertext
    )
    const payload: unknown = JSON.parse(new TextDecoder().decode(plaintext))
    if (!isConfirmationToken(payload)) throw new InvalidConfirmationTokenError()
    if (payload.expiresAt <= now) throw new ExpiredConfirmationTokenError()

    return payload
  } catch (error) {
    if (error instanceof ExpiredConfirmationTokenError) throw error
    throw new InvalidConfirmationTokenError()
  }
}

export async function fingerprintEmail(email: string, secret: string) {
  return fingerprint(email, secret, FINGERPRINT_KEY_INFO)
}

export async function fingerprintClient(clientAddress: string, secret: string) {
  return fingerprint(clientAddress, secret, CLIENT_FINGERPRINT_KEY_INFO)
}

async function fingerprint(value: string, secret: string, info: BufferSource) {
  const rootKey = await importSecret(secret)
  const key = await crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: HKDF_SALT,
      info,
    },
    rootKey,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))
  return encodeBase64Url(new Uint8Array(signature))
}

async function deriveTokenKey(secret: string) {
  const rootKey = await importSecret(secret)
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: HKDF_SALT,
      info: TOKEN_KEY_INFO,
    },
    rootKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  )
}

function importSecret(secret: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(secret)) {
    throw new Error("WISHLIST_SECRET must be valid base64url")
  }
  const bytes = new Uint8Array(Buffer.from(secret, "base64url"))
  if (bytes.byteLength !== 32) throw new Error("WISHLIST_SECRET must contain 32 bytes")
  return crypto.subtle.importKey("raw", bytes, "HKDF", false, ["deriveKey"])
}

function isConfirmationToken(value: unknown): value is ConfirmationToken {
  if (!isRecord(value)) return false

  return (
    value.tokenVersion === TOKEN_VERSION &&
    value.purpose === TOKEN_PURPOSE &&
    typeof value.email === "string" &&
    value.email === normalizeEmail(value.email) &&
    isValidEmail(value.email) &&
    typeof value.consentId === "string" &&
    CONSENT_ID_PATTERN.test(value.consentId) &&
    value.consentVersion === CONSENT_VERSION &&
    typeof value.issuedAt === "number" &&
    typeof value.expiresAt === "number" &&
    Number.isInteger(value.issuedAt) &&
    Number.isInteger(value.expiresAt) &&
    value.issuedAt > 0 &&
    value.expiresAt === value.issuedAt + TOKEN_TTL
  )
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string) {
  return (
    email.length > 3 &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    !email.includes("..")
  )
}

function encodeBase64Url(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64url")
}

function decodeBase64Url(value: string) {
  return new Uint8Array(Buffer.from(value, "base64url"))
}
