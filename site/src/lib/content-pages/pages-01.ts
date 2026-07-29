import { published, sources, type ContentPage } from "../content-page-types"

export const pages01: ContentPage[] = [
  {
    slug: "guides",
    category: "Resource hub",
    title: "AI answer accuracy, hallucination, and fact-checking guides",
    seoTitle: "AI Accuracy & Fact-Checking Guides",
    description:
      "Practical guides for checking ChatGPT, Claude, Gemini, Grok, and Google AI answers—plus extension comparisons and verification workflows.",
    dek: "A map for people who want useful AI answers without confusing fluent writing with proof.",
    quickAnswer:
      "Start with the accuracy guide for the overall method, use the fact-check workflow when a claim matters, and use the platform or tool pages when you need a specific setup.",
    intent: "navigational",
    published,
    modified: published,
    readingMinutes: 4,
    schemaType: "CollectionPage",
    sections: [
      {
        title: "Start with the two pillar guides",
        paragraphs: [
          "The safest way to use an AI assistant is not to distrust every sentence. It is to match the amount of verification to the cost of being wrong. These two guides establish that system.",
        ],
        cards: [
          {
            label: "Pillar guide",
            title: "How accurate is ChatGPT?",
            body: "What can go wrong, a risk ladder for deciding what to verify, and a five-minute review loop.",
            slug: "chatgpt-accuracy-guide",
          },
          {
            label: "Pillar guide",
            title: "AI hallucinations explained",
            body: "What hallucinations are, why plausible falsehoods happen, and how grounding changes the workflow.",
            slug: "ai-hallucinations-guide",
          },
        ],
      },
      {
        title: "Do the work: verification playbooks",
        cards: [
          {
            label: "Procedure",
            title: "How to fact-check ChatGPT",
            body: "Break an answer into checkable claims, inspect primary sources, and record what remains uncertain.",
            slug: "how-to-fact-check-chatgpt",
          },
          {
            label: "Procedure",
            title: "How to make ChatGPT double-check",
            body: "A better follow-up prompt, when a second pass helps, and why asking twice is not independent verification.",
            slug: "how-to-make-chatgpt-double-check",
          },
          {
            label: "Use case",
            title: "ChatGPT for research",
            body: "Use AI for framing, query design, and synthesis without treating generated references as evidence.",
            slug: "chatgpt-for-research",
          },
          {
            label: "Use case",
            title: "ChatGPT for students",
            body: "A study workflow that keeps learning, attribution, and final judgment with the student.",
            slug: "chatgpt-for-students",
          },
        ],
      },
      {
        title: "Quick answers to the questions people ask next",
        paragraphs: [
          "These pages answer one narrow search intent first, then point back to the full verification method instead of repeating the pillar guides.",
        ],
        cards: [
          {
            label: "Quick answer",
            title: "Why does ChatGPT make mistakes?",
            body: "The model generates likely language rather than consulting a guaranteed fact database, and tools do not remove every failure mode.",
            slug: "why-does-chatgpt-make-mistakes",
          },
          {
            label: "Quick answer",
            title: "Can ChatGPT give wrong answers?",
            body: "Yes—even when the wording is fluent, detailed, and confident. Learn which claims deserve immediate checking.",
            slug: "can-chatgpt-give-wrong-answers",
          },
          {
            label: "Quick answer",
            title: "Can ChatGPT make up citations?",
            body: "A reference can be fabricated, incomplete, or real but unrelated to the sentence it is supposed to support.",
            slug: "can-chatgpt-make-up-citations",
          },
          {
            label: "Quick answer",
            title: "Can ChatGPT fact-check itself?",
            body: "A second pass can expose defects, but it is not independent verification—even when the answer improves.",
            slug: "can-chatgpt-fact-check-itself",
          },
          {
            label: "Quick answer",
            title: "How accurate is ChatGPT?",
            body: "There is no honest universal percentage; accuracy changes by model, task, tools, evidence, and definition of correct.",
            slug: "how-accurate-is-chatgpt",
          },
          {
            label: "Quick answer",
            title: "What does the ChatGPT warning mean?",
            body: "Translate ‘can make mistakes’ and ‘check important info’ into a short claim-level review workflow.",
            slug: "what-does-chatgpt-can-make-mistakes-mean",
          },
        ],
      },
      {
        title: "Choose a browser extension by job",
        paragraphs: [
          "A reminder, a search layer, a model-comparison workspace, and an automated checker solve different problems. The comparison cluster separates those jobs instead of pretending there is one universal winner.",
        ],
        cards: [
          {
            label: "2026 list",
            title: "Best ChatGPT Chrome extensions for checking answers",
            body: "A job-based shortlist with a transparent selection method and explicit trade-offs.",
            slug: "best-chatgpt-chrome-extensions",
          },
          {
            label: "Alternatives",
            title: "ChatGPT fact-checker extension alternatives",
            body: "Choose among lightweight reminders, prompt builders, web-grounding tools, and multi-model comparison.",
            slug: "chatgpt-fact-checker-extension-alternatives",
          },
          {
            label: "Comparison",
            title: "Makes Mistakes vs WebChatGPT",
            body: "Minimal reminder layer versus deeper search and source retrieval—and when both can coexist.",
            slug: "makes-mistakes-vs-webchatgpt",
          },
          {
            label: "Comparison",
            title: "Makes Mistakes vs AI fact-checkers",
            body: "What a re-check prompt can do, what a verification engine can do, and what neither should claim.",
            slug: "makes-mistakes-vs-ai-fact-checkers",
          },
        ],
      },
      {
        title: "Platform and feature pages",
        cards: [
          {
            title: "ChatGPT makes mistakes",
            body: "The familiar disclaimer, the extension's exact behavior, and a responsible response when an answer looks wrong.",
            slug: "chatgpt-makes-mistakes",
          },
          {
            title: "Claude makes mistakes",
            body: "A Claude-specific review workflow and how the button waits until an answer is complete.",
            slug: "claude-makes-mistakes",
          },
          {
            title: "Gemini makes mistakes",
            body: "How the extension relates to Gemini's own source and double-check controls.",
            slug: "gemini-makes-mistakes",
          },
          {
            title: "Grok makes mistakes",
            body: "Why the extension supplies a visible disclaimer where the supported web interface lacks one.",
            slug: "grok-makes-mistakes",
          },
          {
            title: "Google AI Mode makes mistakes",
            body: "A search-answer workflow that keeps linked sources and original pages in view.",
            slug: "google-ai-mode-makes-mistakes",
          },
          {
            title: "Privacy-first AI extension",
            body: "Permissions, local behavior, and the difference between the extension and website analytics.",
            slug: "privacy-first-ai-extension",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Which guide should I read first?",
        answer:
          "Read the ChatGPT accuracy guide first. It gives you the risk ladder and verification loop used by the more specific pages.",
      },
      {
        question: "Do these guides claim that Makes Mistakes fact-checks answers?",
        answer:
          "No. Makes Mistakes changes the visible disclaimer and inserts a follow-up prompt. It does not browse, inspect sources, or certify an answer as true.",
      },
      {
        question: "Are the extension comparisons based on one ranking score?",
        answer:
          "No. They are organized by job because reminder tools, search tools, prompt builders, and multi-model tools have different strengths.",
      },
    ],
    related: [
      "chatgpt-accuracy-guide",
      "ai-hallucinations-guide",
      "best-chatgpt-chrome-extensions",
      "how-to-fact-check-chatgpt",
    ],
    sources: [sources.openAiAccuracy, sources.googleHallucinations],
  },
]
