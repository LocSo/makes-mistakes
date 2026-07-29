import { Link } from "@tanstack/react-router"
import { links } from "@/lib/links"

export function SiteHeader() {
  return (
    <header className="mx-auto w-full max-w-4xl px-6 pt-6">
      <div className="border-gold/15 bg-card/55 flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-4 py-3 backdrop-blur sm:px-5">
        <Link to="/" className="font-heading text-lg tracking-tight">
          Makes Mistakes <span aria-hidden>🤡</span>
        </Link>

        <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <Link
            to="/$slug"
            params={{ slug: "guides" }}
            className="text-muted-foreground hover:text-gold transition-colors"
          >
            Guides
          </Link>
          <Link
            to="/$slug"
            params={{ slug: "best-chatgpt-chrome-extensions" }}
            className="text-muted-foreground hover:text-gold transition-colors"
          >
            Best extensions
          </Link>
          <Link
            to="/$slug"
            params={{ slug: "how-to-fact-check-chatgpt" }}
            className="text-muted-foreground hover:text-gold transition-colors"
          >
            Fact-check workflow
          </Link>
          <a
            href={links.install}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold text-primary-foreground hover:bg-gold-lit rounded-full px-4 py-2 font-semibold transition-colors"
          >
            Add to Chrome
          </a>
        </nav>
      </div>
    </header>
  )
}
