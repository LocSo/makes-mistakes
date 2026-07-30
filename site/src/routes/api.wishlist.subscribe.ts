import { createFileRoute } from "@tanstack/react-router"
import { handleSubscribeRequest, methodNotAllowedResponse } from "@/features/wishlist/http.server"

export const Route = createFileRoute("/api/wishlist/subscribe")({
  server: {
    handlers: {
      POST: ({ request }) => handleSubscribeRequest(request),
      ANY: () => methodNotAllowedResponse(),
    },
  },
})
