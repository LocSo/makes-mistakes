export type ContentSource = {
  name: string
  publisher: string
  url: string
  note: string
}

export type ContentCard = {
  title: string
  body: string
  label?: string
  slug?: string
  href?: string
  bullets?: string[]
}

export type ContentStep = {
  title: string
  body: string
}

export type ContentTable = {
  headers: string[]
  rows: string[][]
}

export type ContentSection = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
  steps?: ContentStep[]
  cards?: ContentCard[]
  table?: ContentTable
  callout?: {
    title: string
    body: string
  }
}

export type ContentPage = {
  slug: string
  category: string
  title: string
  seoTitle?: string
  description: string
  dek: string
  quickAnswer: string
  intent: "informational" | "procedural" | "commercial" | "product" | "navigational"
  published: string
  modified: string
  readingMinutes: number
  schemaType?: "Article" | "CollectionPage" | "WebPage"
  sections: ContentSection[]
  faqs: { question: string; answer: string }[]
  related: string[]
  sources?: ContentSource[]
}

export const published = "2026-07-29"

export const sources = {
  openAiAccuracy: {
    name: "Does ChatGPT tell the truth?",
    publisher: "OpenAI Help Center",
    url: "https://help.openai.com/en/articles/8313428-chatgpt-accuracy-and-limitations",
    note: "OpenAI's guidance on incorrect answers, fabricated citations, confidence, search tools, and verification.",
  },
  googleHallucinations: {
    name: "What are AI hallucinations?",
    publisher: "Google Cloud",
    url: "https://cloud.google.com/discover/what-are-ai-hallucinations",
    note: "A plain-language definition of hallucinations, common causes, examples, and grounding strategies.",
  },
  geminiHelp: {
    name: "Gemini Apps Help",
    publisher: "Google",
    url: "https://support.google.com/gemini/",
    note: "Official help for sources, response review, regeneration, and responsible use of Gemini Apps.",
  },
  grokHelp: {
    name: "About Grok",
    publisher: "X Help Center",
    url: "https://help.x.com/en/using-x/about-grok",
    note: "Official guidance that Grok may provide incorrect or incomplete information and should be independently checked.",
  },
  webChatGpt: {
    name: "WebChatGPT",
    publisher: "WebChatGPT",
    url: "https://www.webchatgpt.app/",
    note: "Official product page describing web search, source links, and one-click prompts for several AI services.",
  },
  sidecar: {
    name: "Sidecar by AutoAlign AI",
    publisher: "Chrome Web Store",
    url: "https://chromewebstore.google.com/detail/sidecar-by-autoalign-ai/fmdfgdonhkjpdigljddfpgeokdmnehpf",
    note: "Store listing describing accuracy, bias, and toxicity checks across AI chats and web content.",
  },
  councilAi: {
    name: "CouncilAI",
    publisher: "Chrome Web Store",
    url: "https://chromewebstore.google.com/detail/councilai/pkgikjeaooaljiglanhonfaechejoajp",
    note: "Store listing describing a multi-model comparison and cross-check workflow.",
  },
  cuey: {
    name: "Cuey",
    publisher: "Cuey",
    url: "https://cuey.io/",
    note: "Official page describing cross-model comparison and portable prompt workflows.",
  },
  factCheckIt: {
    name: "FactCheckIt",
    publisher: "Chrome Web Store",
    url: "https://chromewebstore.google.com/detail/factcheckit/cnelieoghgegjeljiokhmnoifmoooljk",
    note: "Store listing describing locally generated fact-check prompts for webpages, videos, and selected text.",
  },
  verity: {
    name: "Verity — AI Truth Revealer",
    publisher: "Chrome Web Store",
    url: "https://chromewebstore.google.com/detail/verity-%E2%80%94-ai-truth-reveale/pdobceidjkciljhdglpmkkjdbjnaljoo",
    note: "Store listing describing automatic claim checks against cited web sources on several major AI chat interfaces.",
  },
}
