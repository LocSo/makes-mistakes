import { published, type ContentPage } from "../content-page-types"

export const pages09: ContentPage[] = [
  {
    slug: "ai-disclaimer-rewriter",
    category: "Feature",
    title: "AI disclaimer rewriter for five major chat interfaces",
    seoTitle: "AI Disclaimer Rewriter Chrome Extension",
    description:
      "Makes Mistakes rewrites hedged AI disclaimers into direct reminders on ChatGPT, Claude, Gemini, Grok, and Google AI Mode.",
    dek: "The extension changes the sentence users have learned to tune out without altering the conversation itself.",
    quickAnswer:
      "Makes Mistakes finds only the supported interface's disclaimer element, removes the grammatical hedge in the active language, adds a clown, and applies a restrained gold highlight. On Grok, it inserts a disclaimer because the supported web interface has no matching one to rewrite.",
    intent: "product",
    published,
    modified: published,
    readingMinutes: 6,
    schemaType: "WebPage",
    sections: [
      {
        title: "From possibility to reminder",
        table: {
          headers: ["Interface behavior", "Makes Mistakes behavior"],
          rows: [
            ["A disclaimer says the AI can or may make mistakes", "Rewrites the hedge into a direct statement"],
            ["The line is visually easy to ignore", "Adds bold treatment, a slow gold sweep, and a clown"],
            ["Grok has no matching disclaimer in the supported web layout", "Adds ‘Grok makes mistakes. Check important info.’"],
            ["The page uses another supported language", "Applies a language-specific grammatical replacement"],
          ],
        },
      },
      {
        title: "Scoped to the disclaimer",
        paragraphs: [
          "The content script does not search and replace the phrase across the whole page. It targets known disclaimer elements so a user quoting ‘can make mistakes’ in a prompt or conversation is not silently edited.",
          "Modern chat interfaces re-render during navigation and streaming, so the extension watches page changes and reapplies the small transformation when the real disclaimer returns.",
        ],
      },
      {
        title: "What changes and what stays untouched",
        cards: [
          {
            title: "Changes",
            body: "The visible disclaimer wording, its presentation, and the optional addition of a one-click re-check button.",
          },
          {
            title: "Does not change",
            body: "The model, answer generation, provider safety system, account, conversation content, or factual accuracy of the response.",
          },
        ],
      },
      {
        title: "Supported interfaces",
        bullets: [
          "ChatGPT at chatgpt.com and the legacy chat.openai.com host.",
          "Claude at claude.ai.",
          "Gemini at gemini.google.com.",
          "Grok at grok.com.",
          "Google AI Mode on Google Search.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does the extension rewrite my messages?",
        answer:
          "No. It scopes the text replacement to the provider's disclaimer element rather than applying a global page replacement.",
      },
      {
        question: "Does it change the AI model's answer?",
        answer:
          "No. The disclaimer treatment is visual. The separate Improve answer button only inserts a follow-up prompt when you click it.",
      },
      {
        question: "Why add a disclaimer to Grok?",
        answer:
          "The supported Grok web layout does not expose the same kind of persistent disclaimer, so the extension supplies a visible reminder after an answer exists.",
      },
    ],
    related: [
      "multilingual-ai-disclaimers",
      "improve-answer-button",
      "what-does-chatgpt-can-make-mistakes-mean",
      "grok-makes-mistakes",
    ],
  },
  {
    slug: "multilingual-ai-disclaimers",
    category: "Feature",
    title: "Multilingual AI disclaimer rewriting",
    seoTitle: "Multilingual AI Disclaimer Rewriter",
    description:
      "Makes Mistakes rewrites ChatGPT, Claude, Gemini, and Google AI disclaimers with language-specific grammar instead of English-only deletion.",
    dek: "Dropping a hedge is a grammar problem, not a universal find-and-delete operation.",
    quickAnswer:
      "The extension recognizes many localized hedge patterns and replaces each with a language-specific direct form. German moves the verb, Hungarian changes a suffix, and other languages require their own phrase-level rule.",
    intent: "product",
    published,
    modified: published,
    readingMinutes: 6,
    schemaType: "WebPage",
    sections: [
      {
        title: "Why translation is not enough",
        paragraphs: [
          "The same English idea appears as a conjugation, modal verb, suffix, or whole clause in other languages. Removing one token can make the sentence ungrammatical or change the subject agreement.",
          "Makes Mistakes keeps an explicit pattern and replacement for each phrasing it supports. It replaces only the hedge and preserves the model name and surrounding interface text.",
        ],
      },
      {
        title: "Examples of the grammatical problem",
        table: {
          headers: ["Language pattern", "Why it needs its own rule"],
          rows: [
            ["English: can make mistakes", "The modal and verb phrase become a third-person singular statement"],
            ["German: kann Fehler machen", "The finite verb and infinitive structure must be rearranged"],
            ["Hungarian: hibázhat", "The possibility is encoded in the verb suffix"],
            ["Japanese and Korean disclaimer clauses", "The hedge can span a longer formal phrase rather than one word"],
            ["Right-to-left scripts", "Phrase matching and inserted punctuation or emoji must preserve readable order"],
          ],
        },
      },
      {
        title: "Coverage and verification limits",
        paragraphs: [
          "The repository contains rules across dozens of language families and scripts, based on wording observed in live interfaces. The project welcomes native-speaker corrections because grammatically plausible is not the same as naturally phrased.",
          "Provider copy and DOM structure can change independently. A language can remain supported while a new disclaimer wording needs an additional pattern.",
        ],
        callout: {
          title: "Open-source correction path",
          body: "A correction can be proposed against the exact pattern and replacement in the public repository, making the language rule reviewable rather than hidden in a service.",
        },
      },
      {
        title: "What the extension does not translate",
        bullets: [
          "It does not translate your conversation.",
          "It does not change the provider's general interface language.",
          "It does not translate the fixed English Improve answer nudge automatically.",
          "It does not claim every rule has been reviewed by a native speaker.",
        ],
      },
    ],
    faqs: [
      {
        question: "How many languages does Makes Mistakes support?",
        answer:
          "The code includes phrase rules across dozens of languages and scripts. Because providers can change their wording and some rules still welcome native review, the project describes the coverage qualitatively rather than promising a permanent exact count.",
      },
      {
        question: "Does it detect my browser language?",
        answer:
          "It responds to the actual disclaimer text rendered by the AI service, so the matching rule follows the interface wording on the page.",
      },
      {
        question: "Can I suggest a better translation?",
        answer:
          "Yes. The project is open source, and language corrections can be proposed with the observed provider wording and the more natural direct form.",
      },
    ],
    related: [
      "ai-disclaimer-rewriter",
      "chatgpt-makes-mistakes",
      "claude-makes-mistakes",
      "gemini-makes-mistakes",
    ],
  },
  {
    slug: "privacy-first-ai-extension",
    category: "Feature",
    title: "A privacy-first AI chat extension with one permission",
    seoTitle: "Privacy-First AI Chat Chrome Extension",
    description:
      "Review the Makes Mistakes permission model, local page behavior, stored setting, source code, and the separate analytics used by its public website.",
    dek: "A small behavior-changing extension should have a small data and permission surface.",
    quickAnswer:
      "The extension requests only Chrome's storage permission, stores one synced boolean for the button flash, and has no analytics, telemetry, account, or developer endpoint. Its public website is separate and uses cookieless analytics described in the privacy page.",
    intent: "product",
    published,
    modified: published,
    readingMinutes: 7,
    schemaType: "WebPage",
    sections: [
      {
        title: "Extension data flow",
        table: {
          headers: ["Data or capability", "Behavior"],
          rows: [
            ["Conversation text", "Read only in the page as needed to locate supported UI state; not copied to a developer server"],
            ["Disclaimer text", "Matched and rewritten in the current page"],
            ["Flash preference", "One boolean stored through Chrome synced storage"],
            ["Analytics or telemetry", "None in the extension"],
            ["Account", "No Makes Mistakes account"],
            ["Remote API", "No extension endpoint for processing conversations"],
          ],
        },
      },
      {
        title: "Why it still runs on chat domains",
        paragraphs: [
          "A content script needs explicit host matches to modify the supported pages. The manifest lists the ChatGPT, Claude, Gemini, Grok, and Google Search hosts where the feature operates.",
          "Host access is not the same as server transmission. The relevant questions are what code runs, what it reads, what it stores, and where data is sent. The source and manifest are public so those claims can be inspected.",
        ],
      },
      {
        title: "The website is a separate surface",
        paragraphs: [
          "Visits to ai-mistakes.org can be counted with Umami through a same-domain proxy, and install or download clicks can be tracked. The website privacy page describes the fields involved and the optional email wishlist flow.",
          "That website behavior does not add analytics to the installed extension. Keeping the two surfaces explicit avoids the vague claim that the entire project collects nothing everywhere.",
        ],
      },
      {
        title: "A browser-extension privacy checklist",
        bullets: [
          "Read the current manifest permissions and host matches.",
          "Check whether conversation content leaves the browser and which server receives it.",
          "Look for analytics SDKs, remote configuration, and update-time changes.",
          "Confirm what is stored locally or synced through the browser account.",
          "Review the publisher, source code, release history, and privacy disclosure together.",
          "Remove extensions you no longer use and periodically re-check permissions.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does Makes Mistakes collect my ChatGPT conversations?",
        answer:
          "No. The extension has no analytics, telemetry, account, or remote endpoint, and does not copy conversations to the developer.",
      },
      {
        question: "What does the storage permission do?",
        answer:
          "It stores one boolean controlling whether the Improve answer button flashes once when it appears. Chrome's synced storage may carry that preference through your Google account.",
      },
      {
        question: "Does the website collect the same data as the extension?",
        answer:
          "No. The website is separate and may count visits and CTA clicks with cookieless Umami analytics as described in the privacy policy. The extension itself has no analytics.",
      },
    ],
    related: [
      "best-chatgpt-chrome-extensions",
      "ai-disclaimer-rewriter",
      "improve-answer-button",
      "makes-mistakes-vs-webchatgpt",
    ],
  },
]
