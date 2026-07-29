import { links as appLinks, site } from "@/lib/links"

export type SeoFaq = {
  question: string
  answer: string
}

type SeoHeadOptions = {
  title: string
  description: string
  path: string
  type?: "article" | "website"
  robots?: string
  structuredData?: Record<string, unknown>
}

type ContentStructuredDataOptions = {
  title: string
  description: string
  path: string
  category: string
  published: string
  modified: string
  faqs: SeoFaq[]
  schemaType?: "Article" | "CollectionPage" | "WebPage"
}

function absoluteUrl(path: string) {
  if (path === "/") return site.url
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`
}

export function seoHead({
  title,
  description,
  path,
  type = "website",
  robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  structuredData,
}: SeoHeadOptions) {
  const canonical = absoluteUrl(path)
  const resolvedTitle = title.includes(site.name) ? title : `${title} | ${site.name}`

  return {
    meta: [
      { title: resolvedTitle },
      { name: "description", content: description },
      { name: "robots", content: robots },
      { property: "og:title", content: resolvedTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: canonical },
      { property: "og:image", content: `${site.url}/og.png?v=3` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: resolvedTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: `${site.url}/og.png?v=3` },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: structuredData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify(structuredData),
          },
        ]
      : [],
  }
}

export function contentStructuredData({
  title,
  description,
  path,
  category,
  published,
  modified,
  faqs,
  schemaType = "Article",
}: ContentStructuredDataOptions) {
  const url = absoluteUrl(path)
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.tagline,
      inLanguage: "en",
      publisher: { "@id": `${site.url}/#publisher` },
    },
    {
      "@type": "Organization",
      "@id": `${site.url}/#publisher`,
      name: site.name,
      url: site.url,
      sameAs: [appLinks.github],
    },
    {
      "@type": schemaType,
      "@id": `${url}#page`,
      url,
      name: title,
      headline: title,
      description,
      datePublished: published,
      dateModified: modified,
      articleSection: category,
      inLanguage: "en",
      isPartOf: { "@id": `${site.url}/#website` },
      author: { "@id": `${site.url}/#publisher` },
      publisher: { "@id": `${site.url}/#publisher` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: site.name,
          item: site.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Guides",
          item: `${site.url}/guides`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: title,
          item: url,
        },
      ],
    },
  ]

  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      })),
    })
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  }
}

export function homeStructuredData() {
  const sameAs = [appLinks.github]
  if (appLinks.chromeWebStore) sameAs.push(appLinks.chromeWebStore)

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.tagline,
        inLanguage: "en",
        publisher: { "@id": `${site.url}/#publisher` },
      },
      {
        "@type": "Organization",
        "@id": `${site.url}/#publisher`,
        name: site.name,
        url: site.url,
        sameAs,
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${site.url}/#extension`,
        name: site.name,
        applicationCategory: "BrowserApplication",
        operatingSystem: "Chrome",
        description:
          "A privacy-first Chrome extension that rewrites AI disclaimers and adds a one-click double-check prompt.",
        url: site.url,
        downloadUrl: appLinks.install,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  }
}
