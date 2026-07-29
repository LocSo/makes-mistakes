import { published, sources, type ContentPage, type ContentSource } from "./content-page-types"
import { pages01 } from "./content-pages/pages-01"
import { pages02 } from "./content-pages/pages-02"
import { pages03 } from "./content-pages/pages-03"
import { pages04 } from "./content-pages/pages-04"
import { pages05 } from "./content-pages/pages-05"
import { pages06 } from "./content-pages/pages-06"
import { pages07 } from "./content-pages/pages-07"
import { pages08 } from "./content-pages/pages-08"
import { pages09 } from "./content-pages/pages-09"
import { pages10 } from "./content-pages/pages-10"
import { pages11 } from "./content-pages/pages-11"

export type {
  ContentCard,
  ContentPage,
  ContentSection,
  ContentSource,
  ContentStep,
  ContentTable,
} from "./content-page-types"

const pages: ContentPage[] = [
  ...pages01,
  ...pages02,
  ...pages03,
  ...pages04,
  ...pages05,
  ...pages06,
  ...pages07,
  ...pages08,
  ...pages09,
  ...pages10,
  ...pages11,
]

function platformPage({
  slug,
  platform,
  host,
  disclaimer,
  behavior,
  review,
  source,
  related,
}: {
  slug: string
  platform: string
  host: string
  disclaimer: string
  behavior: string
  review: string[]
  source?: ContentSource
  related: string[]
}): ContentPage {
  return {
    slug,
    category: "Platform guide",
    title: `${platform} makes mistakes: what to check after an answer`,
    seoTitle: `${platform} Makes Mistakes: What to Check`,
    description: `Learn how Makes Mistakes changes the ${platform} interface, what the warning means, and how to verify an answer before relying on it.`,
    dek: `A ${platform} answer can be useful, polished, and still contain a decisive error.`,
    quickAnswer: `${behavior} The extension does not determine whether the answer is true; use the visible reminder to start a claim-by-claim review.`,
    intent: "product",
    published,
    modified: published,
    readingMinutes: 6,
    schemaType: "WebPage",
    sections: [
      {
        title: `What Makes Mistakes changes on ${platform}`,
        paragraphs: [
          behavior,
          `The content script is limited to the supported ${host} page and targets interface elements rather than globally replacing words in your conversation.`,
        ],
      },
      {
        title: `What the ${platform} warning means`,
        paragraphs: [
          disclaimer,
          "The warning should change how you use the response, not force you to reject it. Check the claims whose failure would change a decision, and use evidence appropriate to the consequence.",
        ],
      },
      {
        title: `A ${platform}-specific review loop`,
        steps: review.map((body, index) => ({
          title: ["Identify", "Challenge", "Verify", "Record"][index] ?? `Step ${index + 1}`,
          body,
        })),
      },
      {
        title: "What the extension cannot promise",
        bullets: [
          `It does not change the ${platform} model or provider safety system.`,
          "It does not automatically send the follow-up prompt.",
          "It does not open sources, inspect citations, or score factuality.",
          "It does not guarantee that a revised answer is correct.",
        ],
      },
    ],
    faqs: [
      {
        question: `Can ${platform} be confidently wrong?`,
        answer:
          "Yes. Fluent and confident language is not evidence. Verify important specific claims against reliable current sources.",
      },
      {
        question: `Does Makes Mistakes fact-check ${platform}?`,
        answer:
          "No. It makes the disclaimer more direct and inserts a re-check prompt after an answer. The source verification remains a separate step.",
      },
      {
        question: `Does the extension send my ${platform} chat anywhere?`,
        answer:
          "No. The extension has no analytics, telemetry, account, or remote endpoint for conversation processing.",
      },
    ],
    related,
    sources: source ? [source] : undefined,
  }
}

pages.push(
  platformPage({
    slug: "chatgpt-makes-mistakes",
    platform: "ChatGPT",
    host: "chatgpt.com",
    disclaimer:
      "OpenAI says ChatGPT can produce incorrect or misleading output, including fabricated facts and references, and recommends verifying important information from reliable sources.",
    behavior:
      "Makes Mistakes rewrites the familiar ‘ChatGPT can make mistakes’ disclaimer into a direct statement, highlights it, and adds the Improve answer button after an assistant message exists.",
    review: [
      "Mark dates, numbers, citations, current facts, and claims that affect a decision.",
      "Use the button or a structured audit prompt to list assumptions, likely errors, and evidence needed.",
      "Open primary and authoritative sources; match each material sentence to the actual passage.",
      "Save what was verified, contradicted, or unresolved before reusing the answer.",
    ],
    source: sources.openAiAccuracy,
    related: [
      "what-does-chatgpt-can-make-mistakes-mean",
      "how-to-fact-check-chatgpt",
      "improve-answer-button",
      "chatgpt-accuracy-guide",
    ],
  }),
  platformPage({
    slug: "claude-makes-mistakes",
    platform: "Claude",
    host: "claude.ai",
    disclaimer:
      "Claude can summarize, reason over documents, and write fluently while still misreading a passage, omitting a qualification, or supplying unsupported background detail.",
    behavior:
      "Makes Mistakes finds Claude's disclaimer phrasing, removes the hedge in the active supported language, and waits for a completed answer before placing the follow-up button near the composer.",
    review: [
      "Separate claims quoted from supplied documents from claims based on general model knowledge.",
      "Ask for exact passages and source locations, plus every conclusion not supported by the supplied material.",
      "Check the original documents and any external claims independently.",
      "Preserve conflicts, omissions, and uncertainty in the final synthesis.",
    ],
    related: [
      "multilingual-ai-disclaimers",
      "how-to-fact-check-chatgpt",
      "ai-hallucinations-guide",
      "privacy-first-ai-extension",
    ],
  }),
  platformPage({
    slug: "gemini-makes-mistakes",
    platform: "Gemini",
    host: "gemini.google.com",
    disclaimer:
      "Google's help material tells users that Gemini can make mistakes and provides source and response-review controls. Those controls help investigate an answer, but the user still needs to judge the supporting pages.",
    behavior:
      "Makes Mistakes rewrites Gemini's localized disclaimer and positions the Improve answer button alongside Gemini's composer after a model response appears.",
    review: [
      "Use Gemini's related-source or double-check controls when they are available, especially for current factual claims.",
      "Ask which sentences are grounded in retrieved pages and which are inference or general model knowledge.",
      "Open the linked pages and confirm they support the exact claim, date, and context.",
      "Record any statement the available sources cannot evaluate.",
    ],
    source: sources.geminiHelp,
    related: [
      "multilingual-ai-disclaimers",
      "google-ai-mode-makes-mistakes",
      "how-to-fact-check-chatgpt",
      "ai-hallucinations-guide",
    ],
  }),
  platformPage({
    slug: "grok-makes-mistakes",
    platform: "Grok",
    host: "grok.com",
    disclaimer:
      "X's official Grok help warns that Grok may confidently provide factually incorrect information, mis-summarize, or miss context, and encourages independent verification.",
    behavior:
      "Because the supported Grok web layout has no matching persistent disclaimer to rewrite, Makes Mistakes adds ‘Grok makes mistakes. Check important info.’ after an assistant answer exists and supplies the same follow-up button.",
    review: [
      "Distinguish claims about live events from commentary, humor, or interpretation.",
      "Ask for publication dates, event dates, primary sources, and missing context.",
      "Open the original posts, statements, records, or reporting rather than relying on a generated summary.",
      "Mark disputed or fast-moving claims as unresolved until corroborated.",
    ],
    source: sources.grokHelp,
    related: [
      "ai-disclaimer-rewriter",
      "how-to-fact-check-chatgpt",
      "can-chatgpt-give-wrong-answers",
      "privacy-first-ai-extension",
    ],
  }),
  platformPage({
    slug: "google-ai-mode-makes-mistakes",
    platform: "Google AI Mode",
    host: "google.com/search",
    disclaimer:
      "An AI answer embedded in search can still omit, combine, or misstate what the linked pages say. The presence of search results makes evidence easier to inspect, not automatically correct.",
    behavior:
      "Makes Mistakes rewrites the AI Mode footer disclaimer when its stable support-link structure appears and adds a button beside the plain-text query composer after a completed answer.",
    review: [
      "Identify which claims depend on recent web information and note the event date as well as the publication date.",
      "Ask for the source-to-claim mapping and for pages that disagree with the summary.",
      "Open the original pages, prefer primary sources, and inspect the relevant passage in context.",
      "Do not treat the answer box as a replacement for visiting the evidence.",
    ],
    source: sources.googleHallucinations,
    related: [
      "gemini-makes-mistakes",
      "how-to-fact-check-chatgpt",
      "ai-hallucinations-guide",
      "makes-mistakes-vs-webchatgpt",
    ],
  })
)

export const contentPages = pages.sort((left, right) => left.title.localeCompare(right.title))

const contentBySlug = new Map(contentPages.map((page) => [page.slug, page]))

export function getContentPage(slug: string) {
  return contentBySlug.get(slug)
}
