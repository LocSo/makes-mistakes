import { createFileRoute } from "@tanstack/react-router"
import { handleConfirmRequest, methodNotAllowedResponse } from "@/features/wishlist/http.server"

export const Route = createFileRoute("/api/wishlist/confirm")({
  server: {
    handlers: {
      POST: ({ request }) => handleConfirmRequest(request),
      ANY: () => methodNotAllowedResponse(),
    },
  },
})
