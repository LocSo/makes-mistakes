import { createFileRoute, notFound } from "@tanstack/react-router"
import { ContentPage } from "@/components/content-page"
import { getContentPage } from "@/lib/content-pages"
import { contentStructuredData, seoHead } from "@/lib/seo"

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const page = getContentPage(params.slug)
    if (!page) throw notFound()
    return { page }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { page } = loaderData
    return seoHead({
      title: page.seoTitle ?? page.title,
      description: page.description,
      path: `/${page.slug}`,
      type: page.schemaType === "WebPage" ? "website" : "article",
      structuredData: contentStructuredData({
        title: page.title,
        description: page.description,
        path: `/${page.slug}`,
        category: page.category,
        published: page.published,
        modified: page.modified,
        faqs: page.faqs,
        schemaType: page.schemaType,
      }),
    })
  },
  component: ContentRoute,
})

function ContentRoute() {
  const { page } = Route.useLoaderData()
  return <ContentPage page={page} />
}
