import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router"
import { umamiWebsiteId } from "@/lib/analytics"
import { site } from "@/lib/links"
import appCss from "../styles.css?url"

const microsoftClarityScript = `(function (c, l, a, r, i, t, y) {
  if (c[a]) return;
  c[a] = function () { (c[a].q = c[a].q || []).push(arguments); };
  t = l.createElement(r);
  t.async = 1;
  t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0];
  y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "qz3eu0y36m");`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0b0a08" },
      { title: `${site.name} — ${site.tagline}` },
    ],
    // Served from our own domain (see routes/stats.$.ts) so ad blockers have nothing to
    // match on; data-host-url sends the collected events back through the same proxy.
    scripts: umamiWebsiteId
      ? [
          {
            src: "/stats/script.js",
            defer: true,
            "data-website-id": umamiWebsiteId,
            "data-host-url": "/stats",
          },
        ]
      : [],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤡</text></svg>",
      },
    ],
  }),
  notFoundComponent: NotFound,
  component: RootLayout,
  shellComponent: RootDocument,
})

// Full-height column so short pages (like /privacy) still push the footer to the bottom.
function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Outlet />
    </div>
  )
}

function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="font-heading text-gold text-7xl">404</p>
      <p className="text-muted-foreground">This page can make mistakes too. It made one.</p>
      <a href="/" className="text-gold hover:text-gold-lit underline underline-offset-4">
        Back home
      </a>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {import.meta.env.PROD ? (
          <script dangerouslySetInnerHTML={{ __html: microsoftClarityScript }} />
        ) : null}
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
