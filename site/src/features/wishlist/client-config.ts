export const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() || null

export const turnstileAppearance = import.meta.env.DEV ? "always" : "interaction-only"
