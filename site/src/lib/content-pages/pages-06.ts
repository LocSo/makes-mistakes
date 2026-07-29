import { published, sources, type ContentPage } from "../content-page-types"

export const pages06: ContentPage[] = [
  {
    slug: "why-does-chatgpt-make-mistakes",
    category: "Quick answer",
    title: "Why does ChatGPT make mistakes?",
    seoTitle: "Why Does ChatGPT Make Mistakes?",
    description:
      "ChatGPT can make mistakes because fluent text generation is not the same as fact retrieval, and context, grounding, ambiguity, and tools all affect the result.",
    dek: "The model is optimized to produce a useful continuation, not to attach a proof certificate to every sentence.",
    quickAnswer:
      "ChatGPT predicts useful text from learned patterns. When evidence is missing, ambiguous, outdated, or poorly retrieved, it can produce a plausible completion that is wrong. Confidence and fluency do not measure factual reliability.",
    intent: "informational",
    published,
    modified: published,
    readingMinutes: 5,
    sections: [
      {
        title: "Five common reasons",
        cards: [
          {
            title: "Pattern generation",
            body: "The next words can be linguistically likely even when the underlying proposition is false.",
          },
          {
            title: "Missing grounding",
            body: "Without a current source or supplied document, the answer may rely on incomplete learned patterns.",
          },
          {
            title: "Ambiguous prompts",
            body: "The model may guess which meaning, time period, product version, or jurisdiction you intended.",
          },
          {
            title: "Weak or conflicting sources",
            body: "Search and retrieval can surface outdated, derivative, or contradictory material.",
          },
          {
            title: "Pressure to complete",
            body: "A helpful-sounding full answer may be generated where ‘I do not have enough evidence’ would be safer.",
          },
        ],
      },
      {
        title: "Mistake does not always mean hallucination",
        paragraphs: [
          "Some errors are ordinary misunderstandings, stale information, arithmetic mistakes, or oversimplification. ‘Hallucination’ is most useful when the response invents or presents unsupported material as though it were grounded.",
        ],
      },
      {
        title: "What to do next",
        steps: [
          {
            title: "Clarify the scope",
            body: "Specify date, location, version, definitions, and the decision you are trying to make.",
          },
          {
            title: "Ask for the vulnerable claims",
            body: "Have the model list assumptions and the statements most likely to be wrong or stale.",
          },
          {
            title: "Verify important claims",
            body: "Open authoritative sources and match them to each proposition before relying on the result.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does ChatGPT know that it is making a mistake?",
        answer:
          "Not in the human sense. It can sometimes detect inconsistencies or revise after critique, but it does not have guaranteed access to the truth of every generated sentence.",
      },
      {
        question: "Why does ChatGPT sound certain when it is wrong?",
        answer:
          "Confidence is a writing style produced by the model. It is not a calibrated factuality signal unless the system provides specific evidence or evaluation for that claim.",
      },
      {
        question: "Can sources stop ChatGPT mistakes?",
        answer:
          "Sources reduce some risks and make checking possible, but the model can still select weak material or misread a good source. Inspect the source directly.",
      },
    ],
    related: [
      "ai-hallucinations-guide",
      "can-chatgpt-give-wrong-answers",
      "how-accurate-is-chatgpt",
      "how-to-fact-check-chatgpt",
    ],
    sources: [sources.openAiAccuracy, sources.googleHallucinations],
  },
  {
    slug: "can-chatgpt-give-wrong-answers",
    category: "Quick answer",
    title: "Can ChatGPT give wrong answers?",
    seoTitle: "Can ChatGPT Give Wrong Answers? Yes—Here’s What to Check",
    description:
      "Yes, ChatGPT can give incorrect or misleading answers, including fabricated citations. Learn the warning signs and what to verify first.",
    dek: "A useful answer can contain one decisive false detail. Review the claims, not only the overall impression.",
    quickAnswer:
      "Yes. ChatGPT can provide wrong facts, fabricated references, outdated guidance, incorrect calculations, and overconfident interpretations. Check specific, current, cited, surprising, and consequential claims first.",
    intent: "informational",
    published,
    modified: published,
    readingMinutes: 5,
    sections: [
      {
        title: "Wrong answers can look normal",
        paragraphs: [
          "The difficult cases are not nonsense. They are answers that are mostly coherent and perhaps mostly correct, with one false date, missing limitation, invented quotation, or unsupported causal claim.",
        ],
      },
      {
        title: "Check these claims first",
        bullets: [
          "Named citations, quotations, studies, laws, standards, and court cases.",
          "Current prices, schedules, product features, policies, office-holders, and software versions.",
          "Exact percentages, thresholds, rankings, and calculations.",
          "Medical, legal, financial, safety, employment, or academic guidance.",
          "Claims that begin from an assumption you did not explicitly provide.",
        ],
      },
      {
        title: "Four ways an answer can be wrong",
        cards: [
          {
            title: "False detail",
            body: "The overall explanation is sound but a name, date, figure, quotation, or version is incorrect.",
          },
          {
            title: "Unsupported certainty",
            body: "The conclusion may be possible, but the answer presents it as settled without enough evidence.",
          },
          {
            title: "Missing context",
            body: "A true statement becomes misleading because a jurisdiction, exception, time period, or limitation is omitted.",
          },
          {
            title: "Fabricated support",
            body: "A citation, source, action, or capability is invented to make the answer look grounded.",
          },
        ],
      },
      {
        title: "A fast response when something looks wrong",
        steps: [
          {
            title: "Quote the suspect sentence",
            body: "Keep the challenge focused on one checkable proposition.",
          },
          {
            title: "Ask for source status",
            body: "Request the exact source and whether it was actually opened or merely suggested from memory.",
          },
          {
            title: "Check independently",
            body: "Use an authoritative current source and compare its wording and scope.",
          },
          {
            title: "Correct the record",
            body: "Revise the downstream document or decision, not only the chat response.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can ChatGPT make up citations?",
        answer:
          "Yes. OpenAI's own accuracy guidance lists fabricated quotes, studies, citations, and references as examples of incorrect output.",
      },
      {
        question: "Is a wrong answer a lie?",
        answer:
          "Calling it a lie implies intent. It is more precise to describe the output as incorrect, fabricated, unsupported, or misleading and then verify the claim.",
      },
      {
        question: "What should I do after finding a wrong answer?",
        answer:
          "Save the evidence, correct anything that used the claim, report feedback to the provider, and adjust your prompt or verification process to catch the same failure earlier.",
      },
    ],
    related: [
      "why-does-chatgpt-make-mistakes",
      "how-accurate-is-chatgpt",
      "how-to-fact-check-chatgpt",
      "chatgpt-makes-mistakes",
    ],
    sources: [sources.openAiAccuracy],
  },
  {
    slug: "how-accurate-is-chatgpt",
    category: "Quick answer",
    title: "How accurate is ChatGPT?",
    seoTitle: "How Accurate Is ChatGPT? Why One Percentage Misleads",
    description:
      "ChatGPT accuracy varies by task, model, tools, prompt, and evaluation method. Use a risk-based standard instead of one universal percentage.",
    dek: "Accuracy on a benchmark is not the same as reliability for your exact question today.",
    quickAnswer:
      "There is no single meaningful accuracy percentage for all ChatGPT uses. Reliability changes with the task, model, source access, prompt clarity, time sensitivity, and definition of correctness.",
    intent: "informational",
    published,
    modified: published,
    readingMinutes: 5,
    sections: [
      {
        title: "Why one number fails",
        bullets: [
          "Different models and modes perform differently.",
          "A closed-book trivia test is not the same as source-grounded research.",
          "Partial correctness and missing qualifications are hard to reduce to one score.",
          "Current events, niche facts, calculations, and judgment tasks have different failure modes.",
          "Benchmarks can age or become unlike normal user questions.",
        ],
      },
      {
        title: "Measure fitness for the actual decision",
        table: {
          headers: ["Question", "What to evaluate"],
          rows: [
            ["Did it rewrite my paragraph well?", "Fit to your intent, preserved meaning, tone, and omissions"],
            ["Is this current policy correct?", "Official source, effective date, jurisdiction, and exceptions"],
            ["Is this analysis persuasive?", "Evidence quality, counterarguments, assumptions, and causal logic"],
            ["Is this calculation right?", "Inputs, formula, units, intermediate steps, and independent reproduction"],
          ],
        },
      },
      {
        title: "Tools can improve the process without creating certainty",
        paragraphs: [
          "Search, deep research, supplied files, calculators, and code execution can give the model better evidence or a more exact method. They often improve reliability for the task they address.",
          "They also create new things to inspect: whether the right source was retrieved, whether the source supports the sentence, whether a tool actually ran, and whether the model interpreted the result correctly.",
        ],
        bullets: [
          "A citation makes a claim auditable, not automatically true.",
          "A newer model can still fail on a new, niche, ambiguous, or adversarial question.",
          "A benchmark result does not transfer unchanged to your prompt and decision.",
        ],
      },
      {
        title: "A practical standard",
        paragraphs: [
          "Use ChatGPT freely where you can directly judge the output, such as rewriting your own text. Raise the verification standard as the facts become more specific, current, external, or consequential.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is ChatGPT 100% accurate?",
        answer:
          "No. OpenAI states that ChatGPT can produce incorrect or misleading outputs and recommends verifying important information.",
      },
      {
        question: "Is paid ChatGPT always more accurate?",
        answer:
          "Plans can change access to models and tools, but no plan makes every answer correct. Evaluate the actual model, tools, sources, and task.",
      },
      {
        question: "How can I test accuracy for my use case?",
        answer:
          "Build a representative set of questions with known answers, score claim-level correctness and omissions, repeat across the exact model and settings, and include current and edge cases.",
      },
    ],
    related: [
      "chatgpt-accuracy-guide",
      "can-chatgpt-give-wrong-answers",
      "why-does-chatgpt-make-mistakes",
      "what-does-chatgpt-can-make-mistakes-mean",
    ],
    sources: [sources.openAiAccuracy],
  },
]
