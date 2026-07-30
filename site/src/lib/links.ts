// Set VITE_CHROME_WEB_STORE_URL in Vercel once the listing is published; until then the
// primary button falls back to the GitHub release so it is never a dead end.
const storeUrl = import.meta.env.VITE_CHROME_WEB_STORE_URL?.trim() || null

export const links = {
  github: "https://github.com/xkelxmc/makes-mistakes",
  releases: "https://github.com/xkelxmc/makes-mistakes/releases/latest",
  // Resolves to the newest release's asset — the build publishes a version-less copy
  // precisely so this stays valid.
  zip: "https://github.com/xkelxmc/makes-mistakes/releases/latest/download/makes-mistakes.zip",
  issues: "https://github.com/xkelxmc/makes-mistakes/issues",
  chromeWebStore: storeUrl,
  install: storeUrl ?? "https://github.com/xkelxmc/makes-mistakes/releases/latest",
  suggest:
    "https://github.com/xkelxmc/makes-mistakes/issues/new?labels=feature&title=Feature%3A+&body=What+should+the+extension+do%3F",
}

export const site = {
  name: "Makes Mistakes",
  tagline: "ChatGPT makes mistakes. The footer finally admits it.",
  url: "https://ai-mistakes.org",
}
