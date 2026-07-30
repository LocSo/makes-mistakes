# TanStack Start + shadcn/ui

This is a template for a new TanStack Start project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Wishlist infrastructure

The production double opt-in flow expects:

- a Resend Segment referenced by `RESEND_SEGMENT_ID`;
- a domain-restricted Sending access key in `RESEND_API_KEY`;
- a full-access Resend key in `RESEND_CONTACTS_API_KEY` for Contacts and Segment membership;
- Resend string Contact properties named `confirmed_at`, `consent_version`, `consent_source`, and
  `consent_id`;
- a Resend team whose Contacts are dedicated to this launch list, because `unsubscribed` is
  team-wide rather than Segment-specific;
- disabled open and click tracking on the Resend sending domain;
- an Upstash Redis database for the resend cooldown and per-client rate limit;
- an optional Cloudflare Turnstile widget enabled by `VITE_TURNSTILE_SITE_KEY`.

Runtime variables are listed in `.env.example`.
