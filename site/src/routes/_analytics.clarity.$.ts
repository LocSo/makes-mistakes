import { createFileRoute } from "@tanstack/react-router"
import { handleClarityRequest } from "@/lib/clarity-proxy.js"

async function handle({ request }: { request: Request }) {
  return (await handleClarityRequest(request)) ?? new Response("Not found", { status: 404 })
}

export const Route = createFileRoute("/_analytics/clarity/$")({
  server: {
    handlers: {
      GET: handle,
      HEAD: handle,
      POST: handle,
    },
  },
})
