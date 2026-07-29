import { Link } from "@tanstack/react-router"
import { ArrowRight, Check, ExternalLink } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { track } from "@/lib/analytics"
import {
  getContentPage,
  type ContentCard,
  type ContentPage as ContentPageData,
} from "@/lib/content-pages"
import { links } from "@/lib/links"

function anchorFor(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`))
}

function ContentCardLink({ card }: { card: ContentCard }) {
  const className =
    "border-gold/15 bg-card/55 hover:border-gold/35 group flex h-full flex-col rounded-2xl border p-5 transition-colors"

  const content = (
    <>
      {card.label ? (
        <p className="text-gold mb-3 text-[10px] font-semibold tracking-[0.2em] uppercase">
          {card.label}
        </p>
      ) : null}
      <h3 className="font-heading text-xl leading-tight">{card.title}</h3>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{card.body}</p>
      {card.bullets?.length ? (
        <ul className="text-muted-foreground mt-4 space-y-2 text-sm leading-relaxed">
          {card.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <Check className="text-gold mt-1 size-3.5 flex-none" aria-hidden />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {card.slug || card.href ? (
        <span className="text-gold mt-5 inline-flex items-center gap-1.5 text-xs font-semibold">
          Read more
          {card.href ? (
            <ExternalLink className="size-3.5" aria-hidden />
          ) : (
            <ArrowRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          )}
        </span>
      ) : null}
    </>
  )

  if (card.slug) {
    return (
      <Link to="/$slug" params={{ slug: card.slug }} className={className}>
        {content}
      </Link>
    )
  }

  if (card.href) {
    return (
      <a href={card.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    )
  }

  return <article className={className}>{content}</article>
}

export function ContentPage({ page }: { page: ContentPageData }) {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-6 pt-14 pb-16 sm:pt-20">
        <article>
          <nav
            aria-label="Breadcrumb"
            className="text-muted-foreground flex flex-wrap gap-2 text-xs"
          >
            <Link to="/" className="hover:text-gold transition-colors">
              Makes Mistakes
            </Link>
            <span aria-hidden>/</span>
            <Link
              to="/$slug"
              params={{ slug: "guides" }}
              className="hover:text-gold transition-colors"
            >
              Guides
            </Link>
            <span aria-hidden>/</span>
            <span aria-current="page" className="text-foreground/75">
              {page.title}
            </span>
          </nav>

          <header className="mt-8 max-w-3xl">
            <p className="text-gold text-[11px] font-semibold tracking-[0.24em] uppercase">
              {page.category}
            </p>
            <h1 className="font-heading mt-5 text-[clamp(2.65rem,7vw,5rem)] leading-[1.02] tracking-tight">
              {page.title}
            </h1>
            <p className="text-muted-foreground mt-7 max-w-2xl text-base leading-relaxed sm:text-lg">
              {page.dek}
            </p>
            <div className="text-muted-foreground/75 mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span>Updated {formatDate(page.modified)}</span>
              <span aria-hidden>·</span>
              <span>{page.readingMinutes} min read</span>
            </div>
          </header>

          <aside
            className="border-gold/25 bg-gold/6 mt-10 rounded-2xl border p-5 sm:p-6"
            aria-label="Quick answer"
          >
            <p className="text-gold text-[10px] font-semibold tracking-[0.22em] uppercase">
              Quick answer
            </p>
            <p className="mt-3 text-sm leading-relaxed sm:text-base">{page.quickAnswer}</p>
          </aside>

          {page.sections.length > 2 ? (
            <nav className="border-gold/15 mt-10 rounded-2xl border p-5" aria-label="On this page">
              <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.2em] uppercase">
                On this page
              </p>
              <ol className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                {page.sections.map((section, index) => (
                  <li key={section.title}>
                    <a
                      href={`#${anchorFor(section.title)}`}
                      className="text-muted-foreground hover:text-gold inline-flex gap-2 transition-colors"
                    >
                      <span className="text-gold/60 tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <div className="mt-14 space-y-16">
            {page.sections.map((section) => (
              <section key={section.title} id={anchorFor(section.title)} className="scroll-mt-8">
                <h2 className="font-heading text-3xl leading-tight sm:text-4xl">{section.title}</h2>

                {section.paragraphs?.length ? (
                  <div className="text-muted-foreground mt-5 space-y-4 text-[15px] leading-7">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}

                {section.bullets?.length ? (
                  <ul className="text-muted-foreground mt-6 space-y-3 text-[15px] leading-7">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <Check className="text-gold mt-1.5 size-4 flex-none" aria-hidden />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {section.steps?.length ? (
                  <ol className="mt-7 space-y-4">
                    {section.steps.map((step, index) => (
                      <li
                        key={`${step.title}-${index}`}
                        className="border-gold/15 bg-card/45 grid gap-4 rounded-2xl border p-5 sm:grid-cols-[2.5rem_1fr]"
                      >
                        <span className="border-gold/30 text-gold flex size-9 items-center justify-center rounded-full border text-xs tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="font-heading text-xl leading-tight">{step.title}</h3>
                          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                            {step.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : null}

                {section.cards?.length ? (
                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    {section.cards.map((card) => (
                      <ContentCardLink
                        key={`${card.title}-${card.slug ?? card.href ?? "card"}`}
                        card={card}
                      />
                    ))}
                  </div>
                ) : null}

                {section.table ? (
                  <div className="border-gold/15 mt-7 overflow-x-auto rounded-2xl border">
                    <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                      <thead className="bg-gold/8">
                        <tr>
                          {section.table.headers.map((header) => (
                            <th
                              key={header}
                              scope="col"
                              className="text-gold border-gold/15 border-b px-4 py-3 font-semibold"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        {section.table.rows.map((row, rowIndex) => (
                          <tr
                            key={`${row.join("-")}-${rowIndex}`}
                            className="border-gold/10 border-b last:border-b-0"
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={`${cell}-${cellIndex}`}
                                className={`px-4 py-4 align-top leading-relaxed ${
                                  cellIndex === 0 ? "text-foreground font-medium" : ""
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                {section.callout ? (
                  <aside className="border-gold/25 bg-gold/6 mt-7 rounded-2xl border p-5">
                    <h3 className="font-heading text-gold-lit text-xl">{section.callout.title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {section.callout.body}
                    </p>
                  </aside>
                ) : null}
              </section>
            ))}
          </div>

          {page.sources?.length ? (
            <section className="mt-16" id="sources">
              <h2 className="font-heading text-3xl">Sources and further reading</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
                Product details and guidance were checked against these first-party pages on{" "}
                {formatDate(page.modified)}. Re-check current listings before making an install or
                high-stakes decision.
              </p>
              <ul className="mt-5 space-y-3">
                {page.sources.map((source) => (
                  <li key={source.url} className="border-gold/15 rounded-xl border p-4">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold-lit inline-flex items-center gap-1.5 text-sm font-semibold"
                    >
                      {source.name}
                      <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                    <p className="text-muted-foreground mt-1 text-xs">{source.publisher}</p>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {source.note}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {page.faqs.length ? (
            <section className="mt-16" id="faq">
              <p className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase">FAQ</p>
              <h2 className="font-heading mt-3 text-3xl sm:text-4xl">Questions people ask</h2>
              <div className="mt-6 divide-y divide-[color-mix(in_srgb,var(--gold)_14%,transparent)]">
                {page.faqs.map((faq) => (
                  <details key={faq.question} className="group py-4">
                    <summary className="font-heading hover:text-gold cursor-pointer list-none pr-8 text-xl transition-colors marker:content-none">
                      {faq.question}
                    </summary>
                    <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-16">
            <h2 className="font-heading text-3xl">Continue the topic</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {page.related.map((slug) => (
                <RelatedPageLink key={slug} slug={slug} />
              ))}
            </div>
          </section>

          <aside className="border-gold/25 bg-card/65 relative mt-16 overflow-hidden rounded-3xl border p-7 sm:p-10">
            <div className="bg-gold/8 pointer-events-none absolute -top-20 -right-20 size-64 rounded-full blur-3xl" />
            <div className="relative max-w-2xl">
              <p className="text-gold text-[10px] font-semibold tracking-[0.22em] uppercase">
                Keep the warning visible
              </p>
              <h2 className="font-heading mt-4 text-3xl leading-tight sm:text-4xl">
                ChatGPT makes mistakes. The footer should admit it.
              </h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
                Makes Mistakes rewrites the disclaimer and adds one button that starts a re-check.
                It is free, open source, and deliberately not a fake truth machine.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={links.install}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("store", { from: page.slug })}
                  className="bg-gold text-primary-foreground hover:bg-gold-lit inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold transition-colors"
                >
                  Add to Chrome
                </a>
                <Link
                  to="/$slug"
                  params={{ slug: "privacy-first-ai-extension" }}
                  className="border-gold/25 hover:border-gold/50 inline-flex h-11 items-center rounded-full border px-6 text-sm font-semibold transition-colors"
                >
                  Review privacy
                </Link>
              </div>
            </div>
          </aside>
        </article>
      </main>

      <SiteFooter />
    </>
  )
}

function RelatedPageLink({ slug }: { slug: string }) {
  const relatedPage = getContentPage(slug)

  return (
    <Link
      to="/$slug"
      params={{ slug }}
      className="border-gold/15 hover:border-gold/35 group flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors"
    >
      <span className="text-sm font-medium">{relatedPage?.title ?? slug.replaceAll("-", " ")}</span>
      <ArrowRight
        className="text-gold size-4 flex-none transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  )
}
