import { published, sources, type ContentPage } from "../content-page-types"

export const pages05: ContentPage[] = [
  {
    slug: "how-to-fact-check-chatgpt",
    category: "Verification workflow",
    title: "How to fact-check ChatGPT: a claim-by-claim workflow",
    seoTitle: "How to Fact-Check ChatGPT in 7 Steps",
    description:
      "Fact-check a ChatGPT answer in seven steps: isolate claims, find primary sources, inspect citations, test numbers, and record uncertainty.",
    dek: "Do not ask only whether an answer feels right. Turn it into a list of propositions that evidence can support or reject.",
    quickAnswer:
      "Extract the factual claims, rank them by consequence, ask for assumptions and possible errors, verify each important claim against an authoritative primary source, recalculate numbers, and document unresolved uncertainty.",
    intent: "procedural",
    published,
    modified: published,
    readingMinutes: 9,
    sections: [
      {
        title: "Before you start: preserve the original answer",
        paragraphs: [
          "Copy the answer or share a stable transcript before prompting again. A revised response can silently change claims, making it hard to see what was corrected and what was merely rewritten.",
        ],
      },
      {
        title: "Seven steps",
        steps: [
          {
            title: "1. Split the answer into atomic claims",
            body: "One row per fact: who, what, when, where, number, requirement, cause, quotation, or recommendation premise. Separate compound sentences.",
          },
          {
            title: "2. Rank the claims by consequence",
            body: "Check first what affects money, health, safety, rights, deadlines, grades, production systems, or a public statement.",
          },
          {
            title: "3. Run an adversarial second pass",
            body: "Ask the model to name assumptions, ambiguities, stale facts, disputed points, and the three claims most likely to fail. This creates leads, not proof.",
          },
          {
            title: "4. Find primary and authoritative sources",
            body: "Use the actual law, standard, documentation, paper, dataset, filing, product page, schedule, or original recording where possible.",
          },
          {
            title: "5. Inspect the source, not just the snippet",
            body: "Confirm the exact sentence, context, date, version, jurisdiction, sample, and limitations. Search snippets and AI summaries can omit the part that changes the conclusion.",
          },
          {
            title: "6. Recalculate and reproduce",
            body: "Check arithmetic, units, filters, code, and transformations independently. For data claims, locate the numerator, denominator, and time window.",
          },
          {
            title: "7. Publish a verification note",
            body: "Mark each claim verified, contradicted, partly supported, or unresolved. Link the evidence and record the date you checked it.",
          },
        ],
      },
      {
        title: "A reusable verification table",
        table: {
          headers: ["Claim", "Why it matters", "Evidence needed", "Result"],
          rows: [
            [
              "The policy changed on July 1",
              "Determines whether the planned action is allowed",
              "Official policy and effective-date notice",
              "Verified / contradicted / unresolved",
            ],
            [
              "The study found a 35% improvement",
              "Supports the recommendation",
              "Original paper, outcome definition, sample, and confidence interval",
              "Verified / narrower than stated / unresolved",
            ],
            [
              "This API option exists in version 4",
              "Affects implementation",
              "Versioned official documentation or source code",
              "Verified / renamed / removed",
            ],
          ],
        },
      },
      {
        title: "How to inspect citations",
        bullets: [
          "Search the exact title, author, journal, case number, or URL. No result is a strong warning sign.",
          "Open the original and search for the quoted phrase. A near match is not necessarily the quotation claimed.",
          "Check whether the cited source is primary, a commentary, or another AI-generated summary.",
          "Read the conclusion and limitations, not only the abstract or headline.",
          "Confirm publication date, correction notices, retractions, archived versions, and whether newer guidance supersedes it.",
        ],
      },
      {
        title: "Prompts that make fact-checking easier",
        bullets: [
          "Convert your previous answer into atomic factual claims. Do not revise them yet.",
          "For each claim, state what primary source would be needed to verify it and what evidence would contradict it.",
          "Label every citation as verified-opened, suggested-but-not-opened, supplied-by-user, or model-memory. Never imply you opened a source unless a tool result confirms it.",
          "Return ‘insufficient evidence’ when the source does not support the claim. Do not fill the gap with a plausible guess.",
        ],
      },
      {
        title: "What Makes Mistakes adds",
        paragraphs: [
          "The extension puts a visible reminder at the point where passive acceptance usually happens. Its Improve answer button starts the adversarial second pass in one click.",
          "The remaining six steps are yours. A stronger second answer is still generated text; the fact-check begins when you inspect independent evidence.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can ChatGPT fact-check its own answer?",
        answer:
          "It can critique and revise its answer, especially when search tools or supplied evidence are available. That is useful, but it is not independent verification. Check the sources directly.",
      },
      {
        question: "What sources should I trust when checking ChatGPT?",
        answer:
          "Prefer original and authoritative sources appropriate to the claim: legislation, regulators, standards bodies, official documentation, datasets, peer-reviewed papers, filings, and direct recordings or transcripts.",
      },
      {
        question: "How do I know whether a ChatGPT citation is fake?",
        answer:
          "Search the exact metadata, open the original, and match the passage to the claim. A real-looking citation can be fabricated or point to a source that says something else.",
      },
      {
        question: "Do I need to check every sentence?",
        answer:
          "No. Use consequence and novelty. Check the claims that are specific, current, surprising, cited, or capable of changing a decision.",
      },
    ],
    related: [
      "how-to-make-chatgpt-double-check",
      "chatgpt-accuracy-guide",
      "ai-hallucinations-guide",
      "improve-answer-button",
    ],
    sources: [sources.openAiAccuracy, sources.googleHallucinations],
  },
  {
    slug: "how-to-make-chatgpt-double-check",
    category: "Prompt guide",
    title: "How to make ChatGPT double-check an answer",
    seoTitle: "How to Make ChatGPT Double-Check Its Answer",
    description:
      "Use a structured second-pass prompt to expose assumptions, weak claims, missing evidence, and uncertainty—then verify important facts independently.",
    dek: "‘Are you sure?’ often produces reassurance. A good re-check prompt gives the model a concrete audit job.",
    quickAnswer:
      "Ask ChatGPT to freeze the original claims, list assumptions, identify likely errors, state the evidence each claim needs, and revise only after the audit. Then open the sources yourself; self-correction is not independent proof.",
    intent: "procedural",
    published,
    modified: published,
    readingMinutes: 7,
    sections: [
      {
        title: "Use this stronger double-check prompt",
        callout: {
          title: "Copy and adapt",
          body: "Audit your previous answer before rewriting it. List every factual claim, the assumptions behind it, the strongest reason it may be wrong, what source would verify it, and whether that source was actually opened. Mark unsupported claims as uncertain. Then produce a revised answer that keeps uncertainty next to the relevant sentence and does not invent citations.",
        },
      },
      {
        title: "Why ‘are you sure?’ is weak",
        paragraphs: [
          "A vague challenge does not specify what to inspect. The model may repeat the same reasoning with more confidence, apologize without finding the defect, or change the wording while preserving the underlying error.",
          "An audit prompt creates artifacts you can review: claim list, assumptions, evidence requirements, and changes. That makes unsupported certainty easier to spot.",
        ],
      },
      {
        title: "Four useful second-pass modes",
        cards: [
          {
            title: "Claim audit",
            body: "Best for factual prose. Extract claims, confidence, source status, and possible contradictions.",
          },
          {
            title: "Assumption audit",
            body: "Best when the question is underspecified. Identify every interpretation and ask the missing questions.",
          },
          {
            title: "Counterargument pass",
            body: "Best for recommendations and strategy. Present the strongest opposing evidence and conditions that reverse the conclusion.",
          },
          {
            title: "Reproduction pass",
            body: "Best for code, math, and data. Re-run steps, show intermediate values, and test edge cases independently.",
          },
        ],
      },
      {
        title: "Make the prompt fit the task",
        table: {
          headers: ["Task", "Add this instruction"],
          rows: [
            [
              "Current information",
              "Use current web sources, show publication and event dates, and flag any claim that could have changed.",
            ],
            [
              "Document analysis",
              "Quote the exact passage and page or section for every material claim; label anything not present in the document.",
            ],
            [
              "Calculation",
              "Show formulas, units, intermediate values, and an independent check using a second method.",
            ],
            [
              "Recommendation",
              "State selection criteria, excluded options, trade-offs, and the facts that would change the recommendation.",
            ],
            [
              "High-stakes question",
              "Explain limits, cite authoritative current sources, and identify where qualified professional review is required.",
            ],
          ],
        },
      },
      {
        title: "What the Improve answer button does",
        paragraphs: [
          "Makes Mistakes inserts a compact, intentionally forceful nudge into the composer after an assistant response. It is optimized for speed and emotional clarity, not for a full audit schema.",
          "Use the button to interrupt the flow. Use the longer prompt above when you need a traceable review, and use independent sources when the result matters.",
        ],
      },
    ],
    faqs: [
      {
        question: "Will ChatGPT admit when it is wrong?",
        answer:
          "It sometimes will, especially when given contradictory evidence or a concrete audit task. It can also accept a false correction or produce another unsupported revision, so inspect the evidence.",
      },
      {
        question: "Does asking twice improve accuracy?",
        answer:
          "A structured second pass can reveal defects and improve the response. Repetition alone is weak because the same model can repeat the same error.",
      },
      {
        question: "Should I start a new chat to double-check?",
        answer:
          "A new chat can reduce anchoring on the first answer, but it is still not independent evidence. Give the second chat the exact claim and ask for sources and falsification conditions.",
      },
    ],
    related: [
      "improve-answer-button",
      "how-to-fact-check-chatgpt",
      "can-chatgpt-give-wrong-answers",
      "chatgpt-accuracy-guide",
    ],
    sources: [sources.openAiAccuracy],
  },
]
