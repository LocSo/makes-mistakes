interface ImportMetaEnv {
  readonly VITE_CHROME_WEB_STORE_URL?: string
  readonly VITE_TURNSTILE_SITE_KEY?: string
  readonly VITE_UMAMI_WEBSITE_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  turnstile?: {
    render(
      container: HTMLElement,
      options: {
        sitekey: string
        action: string
        appearance: "always" | "interaction-only"
        size: "flexible"
        callback: (token: string) => void
        "expired-callback": () => void
        "error-callback": () => void
      }
    ): string
    remove(widgetId: string): void
  }
}
