import { Link } from "@tanstack/react-router"
import { links } from "@/lib/links"

export function SiteFooter() {
  return (
    <footer className="mx-auto mt-auto w-full max-w-4xl px-6 pt-10 pb-14">
      <div className="hairline mb-6" />
      <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-xs sm:flex-row sm:items-start">
        <div className="text-center sm:text-left">
          <p>MIT licensed. Not affiliated with OpenAI, Anthropic, Google, or xAI.</p>
          <p className="mt-1 text-[11px] text-current/65">
            A reminder and re-check prompt—not an automated fact checker.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end">
          <Link
            to="/$slug"
            params={{ slug: "guides" }}
            className="hover:text-gold transition-colors"
          >
            Guides
          </Link>
          <Link
            to="/$slug"
            params={{ slug: "best-chatgpt-chrome-extensions" }}
            className="hover:text-gold transition-colors"
          >
            Comparisons
          </Link>
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            GitHub
          </a>
          <a
            href={links.issues}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            Issues
          </a>
          <Link to="/privacy" className="hover:text-gold transition-colors">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  )
}
