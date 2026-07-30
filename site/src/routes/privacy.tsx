import { Link, createFileRoute } from "@tanstack/react-router"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { seoHead } from "@/lib/seo"

const description =
  "Privacy policy for the Makes Mistakes Chrome extension and the separate ai-mistakes.org website, including extension permissions, local storage, website analytics, and the website's launch-notification form."

export const Route = createFileRoute("/privacy")({
  head: () =>
    seoHead({
      title: "Privacy policy",
      description,
      path: "/privacy",
    }),
  component: Privacy,
})

const sections = [
  {
    title: "What is collected",
    body: "Nothing. The extension has no analytics, no telemetry, no remote endpoint, and no account. It never sends a request anywhere.",
  },
  {
    title: "What is stored",
    body: "A single boolean — whether the button should flash once when it appears — kept in Chrome's own synced settings storage. It never leaves your Google account, and we cannot read it.",
  },
  {
    title: "What it can see",
    body: "The content script runs only on chatgpt.com, chat.openai.com, claude.ai, gemini.google.com, grok.com and google.com/search. It reads the page text to find the disclaimer sentence and rewrites it. Your conversations are never copied, stored, or transmitted.",
  },
  {
    title: "Permissions",
    body: "Only `storage`, used for the setting above. No host permissions beyond the six sites listed in the manifest.",
  },
  {
    title: "ai-mistakes.org",
    body: "The website is separate from the extension. Visits are counted with Umami, proxied through this domain. Each request sends the page address and title, the site that linked you here, and your browser language and screen size; from your IP address and user agent Umami derives a country, a browser, an operating system and a device type, along with the hash that stands in for a session. It sets no cookies, identifies nobody, and follows nobody across sites. Clicks on the download and install buttons are recorded the same way.",
  },
  {
    title: "Launch notification on ai-mistakes.org",
    body: "The launch-notification wishlist is a feature of ai-mistakes.org and is completely separate from the Chrome extension. The extension never collects, receives, reads, or transmits your email address. The website uses double opt-in. Cloudflare Turnstile checks the signup for abuse, and Resend processes the address to deliver the confirmation email. Open and click tracking are disabled for these emails. The address becomes a Resend contact only after you explicitly confirm it. We send no newsletter: only one launch notification when the paid version is ready. Upstash Redis holds separate keyed hashes of the address and client IP for a seven-day resend cooldown and a short abuse-prevention rate limit; it never receives the address, IP, or confirmation token. You can request deletion at hello@ai-mistakes.org. Confirmed contacts will be deleted within 30 days after the launch mailing is complete.",
  },
  {
    title: "Changes",
    body: "If this ever changes, it changes in public — the extension is open source and every version is tagged on GitHub.",
  },
]

function Privacy() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl px-6 pt-16 pb-16">
        <Link
          to="/"
          className="text-muted-foreground hover:text-gold text-xs tracking-[0.2em] uppercase transition-colors"
        >
          ← Makes Mistakes
        </Link>

        <h1 className="font-heading mt-8 text-5xl leading-tight">Privacy</h1>
        <p className="text-muted-foreground mt-3 text-sm">
          The extension collects nothing, because it has nowhere to send it.
        </p>

        <div className="hairline my-10" />

        <div className="flex flex-col gap-9">
          {sections.map(({ title, body }) => (
            <section key={title}>
              <h2 className="font-heading text-gold-lit text-xl">{title}</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
