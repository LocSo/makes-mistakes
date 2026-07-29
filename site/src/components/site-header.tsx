import { Link } from "@tanstack/react-router"
import { track } from "@/lib/analytics"
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
          {/* Mirrors the hero CTA: promising "Add to Chrome" while the listing is unpublished
              would hand the visitor a GitHub release page instead. */}
          {links.chromeWebStore ? (
            <a
              href={links.chromeWebStore}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("store", { from: "header" })}
              className="bg-gold text-primary-foreground hover:bg-gold-lit hidden rounded-full px-4 py-2 font-semibold transition-colors sm:inline"
            >
              Add to Chrome
            </a>
          ) : (
            <a
              href={links.zip}
              onClick={() => track("download", { from: "header" })}
              className="bg-gold text-primary-foreground hover:bg-gold-lit hidden rounded-full px-4 py-2 font-semibold transition-colors sm:inline"
            >
              Download .zip
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}
