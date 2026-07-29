import { published, sources, type ContentPage } from "../content-page-types"

export const pages08: ContentPage[] = [
  {
    slug: "can-chatgpt-fact-check-itself",
    category: "Quick answer",
    title: "Can ChatGPT fact-check its own answer?",
    seoTitle: "Can ChatGPT Fact-Check Itself? Limits & Workflow",
    description:
      "ChatGPT can critique and revise its own answer, but the same model checking itself is not independent verification. Use this safer workflow.",
    dek: "Self-correction is useful error hunting. It becomes fact-checking only when claims are tested against appropriate evidence.",
    quickAnswer:
      "ChatGPT can list claims, find contradictions, use search tools, and revise an answer. That can improve accuracy, but it is not independent proof: the second pass can repeat the first error, accept a false correction, or misread a source. Open the evidence and verify the claim yourself.",
    intent: "informational",
    published,
    modified: published,
    readingMinutes: 6,
    sections: [
      {
        title: "What a self-check can do well",
        bullets: [
          "Break a long response into atomic factual claims.",
          "Identify assumptions created by an ambiguous prompt.",
          "Look for contradictions, missing qualifications, unit errors, and unsupported precision.",
          "Use available search or supplied documents to propose evidence for each claim.",
          "Rewrite the answer so uncertainty and disagreements are visible.",
        ],
      },
      {
        title: "Why the second answer can still be wrong",
        cards: [
          {
            title: "Shared reasoning path",
            body: "The same model can reuse the assumptions and associations that produced the original mistake.",
          },
          {
            title: "Persuasive correction",
            body: "A model may accept a user's false challenge and confidently replace a correct answer with an incorrect one.",
          },
          {
            title: "Source-reading error",
            body: "Search can retrieve a real page while the model misquotes it, drops context, or attaches it to the wrong claim.",
          },
          {
            title: "No calibrated certainty",
            body: "A confidence label in ordinary prose is not automatically a measured probability of factual correctness.",
          },
        ],
      },
      {
        title: "Use a structured self-audit",
        callout: {
          title: "Self-check prompt",
          body: "Audit your previous answer before rewriting it. List every factual claim, assumptions, evidence status, strongest reason it may be wrong, and what would verify or falsify it. Mark unsupported claims uncertain. If you use sources, quote the relevant passage and say whether you opened it.",
        },
        paragraphs: [
          "The useful output is not merely a new answer. It is the claim table and evidence requirements, because those give you something concrete to inspect outside the chat.",
        ],
      },
      {
        title: "Turn self-correction into verification",
        steps: [
          {
            title: "Select",
            body: "Prioritize specific, current, cited, surprising, or consequential claims instead of rechecking every sentence equally.",
          },
          {
            title: "Challenge",
            body: "Run the structured audit and ask for counterevidence, ambiguity, and missing context.",
          },
          {
            title: "Retrieve",
            body: "Find the original authoritative source independently or open every source the model used.",
          },
          {
            title: "Compare",
            body: "Match the exact claim to the exact passage, date, version, jurisdiction, and level of certainty.",
          },
          {
            title: "Record",
            body: "Separate verified, contradicted, and unresolved claims before making a decision or publishing the result.",
          },
        ],
      },
      {
        title: "What the Improve answer button contributes",
        paragraphs: [
          "Makes Mistakes removes the friction of starting a second pass by inserting a forceful re-check request after an answer appears. It leaves the message editable and does not send it automatically.",
          "The button initiates self-critique; it does not convert the assistant into an independent fact-checking authority. Use the longer audit prompt and external evidence when the stakes justify it.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does asking ChatGPT ‘are you sure?’ improve accuracy?",
        answer:
          "Sometimes, but the request is vague and can produce reassurance rather than analysis. A claim-level audit with evidence requirements is more useful.",
      },
      {
        question: "Is a new ChatGPT conversation an independent check?",
        answer:
          "No. A new chat can reduce anchoring on the wording of the first answer, but it still relies on the same product and may repeat the same knowledge or reasoning error.",
      },
      {
        question: "Does ChatGPT search make self-fact-checking reliable?",
        answer:
          "Search adds current sources and can improve the process, but the model can still choose weak pages or misrepresent strong ones. Open the cited material and check the exact passage.",
      },
      {
        question: "Can another AI model fact-check ChatGPT?",
        answer:
          "Another model can expose disagreement and missing angles. It is still another generated opinion, so resolve important differences with primary evidence rather than a model vote.",
      },
    ],
    related: [
      "how-to-make-chatgpt-double-check",
      "can-chatgpt-make-up-citations",
      "how-to-fact-check-chatgpt",
      "improve-answer-button",
    ],
    sources: [sources.openAiAccuracy],
  },
  {
    slug: "improve-answer-button",
    category: "Feature",
    title: "Improve answer button for ChatGPT, Claude, Gemini, Grok, and Google AI Mode",
    seoTitle: "One-Click Improve Answer Button for AI Chats",
    description:
      "Add a one-click prompt that asks ChatGPT, Claude, Gemini, Grok, or Google AI Mode to double-check after an answer appears.",
    dek: "The button removes the tiny bit of friction between noticing a doubtful answer and asking for a second pass.",
    quickAnswer:
      "After the assistant has produced an answer, Makes Mistakes adds an Improve answer button near the composer. Clicking it inserts a direct request to double-check; you still decide whether to send, edit, and verify the result.",
    intent: "product",
    published,
    modified: published,
    readingMinutes: 5,
    schemaType: "WebPage",
    sections: [
      {
        title: "What the button does",
        steps: [
          {
            title: "Waits for an answer",
            body: "It does not appear on an empty chat. Each supported interface has its own answer-complete signal and composer layout.",
          },
          {
            title: "Inserts the nudge",
            body: "A click appends: YOU'RE WRONG. DOUBLE-CHECK THE INFORMATION. DON'T LIE TO ME!",
          },
          {
            title: "Leaves control with you",
            body: "The text is inserted into the composer. You can edit it, add a specific audit request, or choose not to send it.",
          },
        ],
      },
      {
        title: "Why the wording is intentionally blunt",
        paragraphs: [
          "The extension is partly a joke and partly a behavioral device. A polite generic retry is easy to ignore; a vivid challenge marks the transition from consumption to review.",
          "For serious work, follow it with a structured instruction: list claims, assumptions, source status, likely errors, and unresolved uncertainty before revising.",
        ],
      },
      {
        title: "What it does not do",
        bullets: [
          "It does not send the prompt automatically.",
          "It does not read, store, or transmit the conversation to a developer endpoint.",
          "It does not search the web or open cited pages.",
          "It does not label claims true or false.",
          "It does not guarantee that the next answer is better.",
        ],
      },
      {
        title: "Best uses",
        cards: [
          {
            title: "Confidently wrong answer",
            body: "Trigger a second pass, then focus it on the exact sentence and source that appear suspect.",
          },
          {
            title: "Long research response",
            body: "Ask for an atomic claim table before you start external verification.",
          },
          {
            title: "Ambiguous request",
            body: "Ask the model to identify the assumptions it made and request clarification before revising.",
          },
          {
            title: "Calculation or code",
            body: "Ask for a reproduction with intermediate steps, test cases, and a second method.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does the Improve answer button automatically send a message?",
        answer:
          "No. It inserts text into the current composer and leaves the final send action with you.",
      },
      {
        question: "Can I customize the inserted prompt?",
        answer:
          "You can edit the text in the composer before sending. The current extension setting only controls whether the button flashes once when it appears.",
      },
      {
        question: "When does the button appear?",
        answer:
          "Only after the supported chat interface contains an assistant answer. It is removed again when the thread has no answer to improve.",
      },
    ],
    related: [
      "how-to-make-chatgpt-double-check",
      "how-to-fact-check-chatgpt",
      "ai-disclaimer-rewriter",
      "privacy-first-ai-extension",
    ],
  },
]
