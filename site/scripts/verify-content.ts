import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { contentPages } from "../src/lib/content-pages"

const siteUrl = "https://ai-mistakes.org"
const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const errors: string[] = []

function check(condition: unknown, message: string) {
  if (!condition) errors.push(message)
}

function words(value: unknown): string[] {
  if (typeof value === "string") return value.match(/[\p{L}\p{N}][\p{L}\p{N}’'-]*/gu) ?? []
  if (Array.isArray(value)) return value.flatMap(words)
  if (!value || typeof value !== "object") return []

  return Object.entries(value)
    .filter(([key]) => !["slug", "url", "href", "published", "modified", "schemaType", "intent"].includes(key))
    .flatMap(([, child]) => words(child))
}

const slugs = new Set<string>()
const titles = new Set<string>()
const descriptions = new Set<string>()

for (const page of contentPages) {
  check(!slugs.has(page.slug), `Duplicate slug: ${page.slug}`)
  check(!titles.has(page.title), `Duplicate page title: ${page.title}`)
  check(!descriptions.has(page.description), `Duplicate description: ${page.slug}`)
  slugs.add(page.slug)
  titles.add(page.title)
  descriptions.add(page.description)

  check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.slug), `Invalid slug: ${page.slug}`)
  check(page.description.length >= 110 && page.description.length <= 180, `Description must be 110-180 characters: ${page.slug}`)
  check(page.quickAnswer.length >= 120, `Quick answer is too thin: ${page.slug}`)
  check(page.sections.length >= 3, `Page needs at least three substantive sections: ${page.slug}`)
  check(new Set(page.sections.map((section) => section.title)).size === page.sections.length, `Duplicate section title on ${page.slug}`)
  check(page.faqs.length >= 3, `Page needs at least three FAQs: ${page.slug}`)
  check(new Set(page.faqs.map((faq) => faq.question)).size === page.faqs.length, `Duplicate FAQ on ${page.slug}`)
  check(page.related.length >= 3, `Page needs at least three related links: ${page.slug}`)
  check(!page.related.includes(page.slug), `Self-referential related link on ${page.slug}`)
  check(new Set(page.related).size === page.related.length, `Duplicate related link on ${page.slug}`)
  check(words(page).length >= 350, `Page is too thin (<350 modeled words): ${page.slug}`)

  for (const source of page.sources ?? []) {
    check(source.url.startsWith("https://"), `Source must use HTTPS on ${page.slug}: ${source.url}`)
  }

  for (const section of page.sections) {
    if (section.table) {
      for (const [index, row] of section.table.rows.entries()) {
        check(
          row.length === section.table.headers.length,
          `Table row ${index + 1} has the wrong width in ${page.slug}: ${section.title}`
        )
      }
    }
  }
}

for (const page of contentPages) {
  for (const related of page.related) {
    check(slugs.has(related), `Broken related slug on ${page.slug}: ${related}`)
  }

  for (const section of page.sections) {
    for (const card of section.cards ?? []) {
      if (card.slug) check(slugs.has(card.slug), `Broken card slug on ${page.slug}: ${card.slug}`)
    }
  }
}

const sitemap = readFileSync(resolve(siteRoot, "public/sitemap.xml"), "utf8")
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]))
const expectedUrls = new Set([
  `${siteUrl}/`,
  `${siteUrl}/privacy`,
  ...contentPages.map((page) => `${siteUrl}/${page.slug}`),
])

for (const url of expectedUrls) check(sitemapUrls.has(url), `Missing sitemap URL: ${url}`)
for (const url of sitemapUrls) check(expectedUrls.has(url), `Unexpected sitemap URL: ${url}`)
check(sitemapUrls.size === expectedUrls.size, "Sitemap contains duplicate or mismatched URLs")

if (errors.length) {
  console.error(`SEO content verification failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  const totalWords = contentPages.reduce((sum, page) => sum + words(page).length, 0)
  console.log(
    `SEO content verification passed: ${contentPages.length} pages, ${sitemapUrls.size} sitemap URLs, ${totalWords.toLocaleString("en-US")} modeled words.`
  )
}
