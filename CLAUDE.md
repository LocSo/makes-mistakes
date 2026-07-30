# Makes Mistakes

A production-quality Chrome extension and public website built around a joke: instead
of saying AI assistants "can make mistakes," it says they make mistakes.

## Overview

The MV3 extension runs on ChatGPT, Claude, Gemini, Grok, and Google AI Mode:

1. It removes hedging from localized AI disclaimers and adds a clown.
2. It mounts an "Improve answer" button in each host's composer layout.

The `site/` application explains the extension, links to the store, and owns the
production double opt-in launch-notification flow.

The meme is the product's acquisition hook, not a reduced quality bar. Treat the
extension, website, integrations, privacy, and release process as production software.

## Stack

- **Extension:** vanilla MV3, JavaScript, and CSS. Do not introduce a framework or
  runtime bundle into the extension.
- **Website:** TanStack Start, React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.
- **Wishlist providers:** Resend, Upstash Redis, and optional Cloudflare Turnstile.
- **Tooling:** pnpm at the workspace root; Bun runs the underlying scripts; oxlint,
  oxfmt, TypeScript, and Vitest perform verification.

## Checks

Run verification only from the repository root:

```bash
pnpm check:fix
pnpm unit-test:run
```

`pnpm check:fix` is the only lint, format, typecheck, and content-check command. Never
run its constituent tools or per-package checks directly. Tests are separate and must
use `pnpm unit-test:run`.

## Conventions

- **English only** in code, comments, filenames, and commit messages.
- **Read a file fully before editing it.** These files are short; there is no excuse
  for a partial read.
- **Comments explain _why_, not _what_.** If a comment has to describe what the code
  does, rewrite the code instead.
- Extension class names and CSS variables are prefixed `mm-` / `--mm-` because the
  content script is a guest inside another application's DOM.
- **Errors belong where they happen.** Do not wrap the observers in blanket try/catch
  to "make it robust"; if a selector breaks, we want to know.

## Host-page fragility

The supported hosts re-render constantly, so:

- All DOM work is driven by a single `MutationObserver` on `document.body`, debounced
  through `requestAnimationFrame`. Do not add polling intervals.
- Prompt insertion uses `document.execCommand("insertText")` for contenteditable
  composers. It is deprecated but it is the only path that fires the `beforeinput`
  events ProseMirror listens for — setting `textContent` silently loses the text on
  the next render. Do not "modernize" it without verifying in a real tab.
- The disclaimer rewrite is restricted to `FOOTERS`; never scan or rewrite arbitrary
  conversation text.
- The button is mounted through the per-host `MOUNTS` configuration in
  `src/content.js`, never through viewport-fixed coordinates.
- `FOOTERS`, `COMPOSER`, `MOUNTS`, and `GRAFT` are the first places to inspect after a
  host redesign.

## Website boundaries

- Website code lives under `site/`; do not apply the extension's vanilla-JS constraint
  there.
- Server-only wishlist modules live under `site/src/features/wishlist/` and import
  `@tanstack/react-start/server-only`.
- Only variables prefixed with `VITE_` may enter the client bundle. Resend, Upstash,
  Turnstile secret, and wishlist encryption keys are server-only.
- Development intentionally uses the real Resend Contacts, Resend email, and Upstash
  providers. Do not replace them with local fakes in the runtime flow.
- The user runs the development server through Portless. Do not start, stop, or
  manipulate the dev server or browser unless explicitly requested.

## Wishlist invariants

- Signup is double opt-in. `GET /wishlist/confirm` never creates or updates a Contact;
  only the explicit confirmation `POST` may do so.
- The confirmation token stays in the URL fragment, is removed with
  `history.replaceState`, and must never appear in logs, Redis, analytics, or
  referrers.
- Resend uses a domain-restricted Sending access key for confirmation email and a
  separate full-access key for Contacts and Segment membership.
- A Resend Contact is created only after confirmation and receives `confirmed_at`,
  `consent_version`, `consent_source`, and `consent_id`.
- The Resend team is dedicated to this launch list because `unsubscribed` is
  team-wide. Open and click tracking remain disabled on the sending domain.
- Upstash stores only keyed fingerprints of normalized email and client IP plus random
  consent IDs. Never store or log raw email, IP, or confirmation tokens there.
- A delivered confirmation gets a seven-day email cooldown. The client limiter allows
  ten successful reservations in a rolling ten-minute window per IP. There is no
  global send cap.
- If the client IP is unavailable, only the IP limiter fails open; never place such
  requests into a shared fallback bucket.
- Turnstile is enabled solely by `VITE_TURNSTILE_SITE_KEY`. With no site key, do not
  import or render the widget and let the server bypass verification. Invalid tokens,
  hostnames, and actions are rejected; provider outages intentionally fail open.
- Public responses do not reveal whether an address already exists or is confirmed.
- The `wishlist` analytics event is sent only after successful explicit confirmation.

## Operational safety

- Do not read or print `.env.local` or `.env.prod` secret values unless explicitly
  requested.
- Do not commit, push, create or switch branches, create PRs, deploy, or mutate Vercel,
  DNS, WAF, or external services without an explicit request.
