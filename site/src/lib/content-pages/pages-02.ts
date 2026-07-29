import { published, sources, type ContentPage } from "../content-page-types"

export const pages02: ContentPage[] = [
  {
    slug: "chatgpt-accuracy-guide",
    category: "Pillar guide",
    title: "How accurate is ChatGPT? A practical guide to checking answers",
    seoTitle: "How Accurate Is ChatGPT? Practical Accuracy Guide",
    description:
      "Understand when ChatGPT is likely to be useful, what it can get wrong, and how to verify important answers with a repeatable workflow.",
    dek: "Accuracy is not a single score. It changes with the question, the available tools, the sources, and the cost of a bad answer.",
    quickAnswer:
      "ChatGPT can be highly useful and still produce false facts, invented references, weak summaries, or confident answers to ambiguous questions. Treat it as a drafting and reasoning aid; verify consequential claims against reliable primary sources.",
    intent: "informational",
    published,
    modified: published,
    readingMinutes: 11,
    sections: [
      {
        title: "There is no honest universal accuracy percentage",
        paragraphs: [
          "A single percentage hides the variables that matter: the model and mode, whether web search or supplied documents are available, how the question is phrased, the age and obscurity of the information, and what counts as correct.",
          "A response can also be partly right. The core explanation may be useful while one date, quotation, limitation, or citation is false. For practical use, claim-level review is more useful than asking whether the entire answer is simply accurate or inaccurate.",
        ],
        callout: {
          title: "A better question",
          body: "Ask: Which claims in this answer would change my decision if they were wrong, and what evidence would independently verify them?",
        },
      },
      {
        title: "What ChatGPT can get wrong",
        cards: [
          {
            title: "Facts and dates",
            body: "Names, dates, figures, requirements, version details, and other specifics can be incorrect or outdated.",
          },
          {
            title: "Quotes and citations",
            body: "A plausible-looking paper, case, quotation, link, or author can be fabricated or mismatched to the claim.",
          },
          {
            title: "Ambiguous questions",
            body: "When the prompt has several interpretations, the answer may silently choose one and present it as settled.",
          },
          {
            title: "Summaries",
            body: "A summary can omit qualifications, merge separate claims, or introduce details that were not in the source.",
          },
          {
            title: "Calculations and transformations",
            body: "Multi-step arithmetic, unit conversion, filtering, or spreadsheet reasoning can fail unless the work is checked.",
          },
          {
            title: "Judgment disguised as fact",
            body: "A recommendation can flatten disagreement or give one perspective more certainty than the evidence supports.",
          },
        ],
      },
      {
        title: "Use a risk ladder, not one rule for every answer",
        table: {
          headers: ["Risk", "Typical use", "Reasonable verification"],
          rows: [
            [
              "Low",
              "Brainstorming names, rewriting your own text, generating practice questions",
              "Read for fit and obvious errors; no external check may be needed.",
            ],
            [
              "Medium",
              "Learning a topic, planning a trip, comparing software, drafting a presentation",
              "Check central facts, dates, prices, availability, and quoted claims.",
            ],
            [
              "High",
              "Medical, legal, financial, safety, employment, academic, or production decisions",
              "Use authoritative current sources and qualified professional review where appropriate. Do not rely on the chat alone.",
            ],
          ],
        },
      },
      {
        title: "A five-minute verification loop",
        steps: [
          {
            title: "Mark the checkable claims",
            body: "Pull out dates, numbers, named sources, requirements, causal statements, and any sentence your decision depends on.",
          },
          {
            title: "Ask for uncertainty and counterevidence",
            body: "Request assumptions, points of dispute, and the strongest reason the answer might be wrong. This is an error-finding pass, not proof.",
          },
          {
            title: "Open the actual sources",
            body: "Prefer laws, standards, documentation, datasets, papers, company announcements, or the original material over summaries of them.",
          },
          {
            title: "Match every source to the exact claim",
            body: "A real link is not enough. Confirm that it supports the sentence, applies to the right jurisdiction or version, and is current enough.",
          },
          {
            title: "Write down what remains uncertain",
            body: "Separate verified facts, reasonable interpretation, and unresolved questions before using the answer downstream.",
          },
        ],
      },
      {
        title: "Prompts that improve the review pass",
        bullets: [
          "List every factual claim in your answer as a table with columns for claim, confidence, source needed, and what would falsify it.",
          "Identify assumptions you made because my question was ambiguous. Ask me the missing questions before revising.",
          "Find the three claims most likely to be wrong, stale, or overly broad. Explain why each is vulnerable.",
          "Separate statements supported by the supplied documents from general background knowledge. Do not invent citations.",
          "Rewrite the answer so that uncertainty, disagreement, and source limitations are visible next to the relevant claim.",
        ],
        callout: {
          title: "What a second prompt cannot do",
          body: "The same model revising itself is not independent confirmation. It can expose weaknesses and improve structure, but important facts still need external evidence.",
        },
      },
      {
        title: "Where Makes Mistakes fits",
        paragraphs: [
          "Makes Mistakes is deliberately a small behavior cue. It removes hedging from supported AI disclaimers, highlights the remaining warning, and adds an Improve answer button after the assistant responds.",
          "That button appends a forceful request to double-check. It does not search the web, read a citation, compare models, or label claims true and false. Its job is to interrupt passive acceptance and make the review step easy to start.",
        ],
        cards: [
          {
            label: "Next step",
            title: "Run the full fact-check workflow",
            body: "Turn the re-check into evidence by decomposing the answer and visiting authoritative sources.",
            slug: "how-to-fact-check-chatgpt",
          },
          {
            label: "Tool choice",
            title: "Compare answer-checking extensions",
            body: "Choose between reminders, search grounding, prompt generation, automated checks, and multi-model comparison.",
            slug: "best-chatgpt-chrome-extensions",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can ChatGPT be confidently wrong?",
        answer:
          "Yes. Fluent wording and confidence are presentation qualities, not evidence. OpenAI explicitly warns that ChatGPT can produce incorrect or misleading output while sounding confident.",
      },
      {
        question: "Does web search make every answer accurate?",
        answer:
          "No. Search can provide current sources, but the model can still choose weak sources, misread them, omit context, or make an unsupported synthesis. Open the cited pages and check the claim yourself.",
      },
      {
        question: "Should I ask ChatGPT for a confidence score?",
        answer:
          "A confidence label can help organize review, but it is not a calibrated probability unless the system specifically establishes that. Ask for evidence and falsification conditions instead.",
      },
      {
        question: "Is ChatGPT safe for medical or legal advice?",
        answer:
          "Use it for general education or question preparation, not as the sole basis for a consequential decision. Verify current authoritative guidance and consult a qualified professional when appropriate.",
      },
    ],
    related: [
      "ai-hallucinations-guide",
      "how-to-fact-check-chatgpt",
      "how-to-make-chatgpt-double-check",
      "can-chatgpt-give-wrong-answers",
    ],
    sources: [sources.openAiAccuracy, sources.googleHallucinations],
  },
]
