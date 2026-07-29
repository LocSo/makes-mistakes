import { published, sources, type ContentPage } from "../content-page-types"

export const pages03: ContentPage[] = [
  {
    slug: "ai-hallucinations-guide",
    category: "Pillar guide",
    title: "AI hallucinations: what they are, why they happen, and how to catch them",
    seoTitle: "AI Hallucinations Explained: Causes, Examples & Checks",
    description:
      "A practical explanation of AI hallucinations, common warning signs, examples, and a verification workflow for generated answers.",
    dek: "A hallucination is not the model seeing something. It is a plausible-looking output that is unsupported, incorrect, or misleading.",
    quickAnswer:
      "AI hallucinations are generated statements that appear coherent but are factually wrong, unsupported, or disconnected from the supplied evidence. Catch them by breaking answers into claims, checking primary sources, and forcing uncertainty into the open.",
    intent: "informational",
    published,
    modified: published,
    readingMinutes: 10,
    sections: [
      {
        title: "What counts as an AI hallucination",
        paragraphs: [
          "The term is used broadly. It can describe a fabricated fact, a made-up citation, an answer that contradicts the provided document, or a confident completion where the evidence is missing.",
          "Not every bad answer is a hallucination. A response may instead be outdated, biased, too vague, based on an ambiguous prompt, or simply a calculation mistake. The practical remedy is similar: identify the claim, inspect its support, and do not let polished prose stand in for evidence.",
        ],
      },
      {
        title: "Common forms",
        cards: [
          {
            title: "Fabrication",
            body: "The answer invents a person, event, quotation, feature, paper, court case, or URL that does not exist.",
          },
          {
            title: "Source mismatch",
            body: "The source exists, but it does not support the claim attributed to it—or applies to a different date, product, or jurisdiction.",
          },
          {
            title: "Document drift",
            body: "The answer is supposed to use supplied material but blends in unsupported background knowledge or details from elsewhere.",
          },
          {
            title: "False precision",
            body: "The response supplies an exact percentage, date, threshold, or causal explanation where the evidence only supports a range or uncertainty.",
          },
          {
            title: "Context loss",
            body: "A statement is technically true in one setting but misleading in the user's actual situation because a qualification was dropped.",
          },
          {
            title: "Capability fiction",
            body: "The assistant claims it performed an action, opened a source, sent a message, or accessed a system that it did not actually use.",
          },
        ],
      },
      {
        title: "Why plausible falsehoods happen",
        paragraphs: [
          "Language models generate likely continuations from patterns. That makes them excellent at producing coherent text, but coherence does not guarantee that each sentence is grounded in a trustworthy record.",
          "Incomplete or biased training material, a lack of grounding, ambiguous instructions, pressure to be helpful, and weak retrieval can all contribute. A model may fill a gap with the shape of an answer instead of stopping at the boundary of what is known.",
        ],
        bullets: [
          "The question assumes something false and the model accepts the premise.",
          "The requested detail is obscure, recent, local, or version-specific.",
          "The answer format rewards completeness even when evidence is sparse.",
          "Retrieved material is low quality, contradictory, or only loosely related.",
          "A long conversation causes instructions or source boundaries to blur.",
        ],
      },
      {
        title: "Warning signs worth checking first",
        bullets: [
          "A precise quotation without a page, timestamp, or direct source.",
          "A paper title or citation that sounds perfectly tailored to the question.",
          "A current price, law, schedule, office-holder, software version, or policy without a dated source.",
          "A sweeping word such as always, never, proven, guaranteed, or everyone.",
          "A claim that the assistant completed an external action with no visible tool result.",
          "Several exact numbers that fit the narrative unusually well.",
          "A source that is real but says something narrower than the answer.",
        ],
      },
      {
        title: "The claim–evidence–decision test",
        steps: [
          {
            title: "Claim",
            body: "State the exact proposition in one sentence. Remove rhetoric and split compound claims apart.",
          },
          {
            title: "Evidence",
            body: "Find an independent source that could prove or disprove that proposition. Prefer original and authoritative material.",
          },
          {
            title: "Decision",
            body: "Ask what changes if the claim is wrong. The higher the consequence, the stronger and more current the evidence should be.",
          },
        ],
        callout: {
          title: "Grounded does not mean infallible",
          body: "An answer can cite sources and still misrepresent them. Grounding makes verification possible; it does not remove the need to inspect the evidence.",
        },
      },
      {
        title: "Reduce hallucination risk before the answer",
        bullets: [
          "Provide the exact documents and say that unsupported background knowledge must be labeled separately.",
          "Ask the model to request clarification instead of guessing when terms, dates, or scope are ambiguous.",
          "Require claim-level citations and permit an explicit ‘not found in the supplied sources’ response.",
          "Constrain the output to a schema that includes evidence, date, uncertainty, and unresolved questions.",
          "Use retrieval, search, calculators, or code execution for tasks that need current data or exact computation.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why are AI hallucinations called hallucinations?",
        answer:
          "The phrase is a metaphor for generated output that is detached from the relevant facts or evidence. It does not mean the model has human perception or experiences.",
      },
      {
        question: "Can an AI hallucination include a real source?",
        answer:
          "Yes. The source may exist while the claim, quotation, page number, or relationship to that source is wrong.",
      },
      {
        question: "Can prompting eliminate hallucinations?",
        answer:
          "No prompt guarantees truth. Better instructions can reduce guessing and expose uncertainty, while retrieval and tools can add evidence, but important claims still need verification.",
      },
      {
        question: "Do all AI models hallucinate?",
        answer:
          "Generative systems can all produce unsupported or incorrect output, though the frequency and type vary by model, task, tools, and evaluation method.",
      },
    ],
    related: [
      "chatgpt-accuracy-guide",
      "why-does-chatgpt-make-mistakes",
      "how-to-fact-check-chatgpt",
      "what-does-chatgpt-can-make-mistakes-mean",
    ],
    sources: [sources.googleHallucinations, sources.openAiAccuracy],
  },
]
