import { published, sources, type ContentPage } from "../content-page-types"

export const pages07: ContentPage[] = [
  {
    slug: "what-does-chatgpt-can-make-mistakes-mean",
    category: "Quick answer",
    title: "What does ‘ChatGPT can make mistakes’ mean?",
    seoTitle: "What Does ‘ChatGPT Can Make Mistakes’ Mean?",
    description:
      "The ChatGPT disclaimer means generated answers may be incorrect or misleading, even when they sound confident. Here is what to check.",
    dek: "It is not decorative legal copy. It is a compact warning about how to use generated answers.",
    quickAnswer:
      "The disclaimer means ChatGPT may produce false facts, fabricated citations, stale information, missing context, or confident interpretations that the evidence does not support. Important claims should be checked against reliable sources.",
    intent: "informational",
    published,
    modified: published,
    readingMinutes: 4,
    sections: [
      {
        title: "Translate the disclaimer into action",
        cards: [
          {
            title: "‘Can make mistakes’",
            body: "Treat factual output as a draft until important claims are verified.",
          },
          {
            title: "‘Check important info’",
            body: "Use authoritative current sources and inspect the original material, not only the model's summary.",
          },
          {
            title: "Confident wording",
            body: "Do not use tone as a proxy for evidence or calibrated certainty.",
          },
        ],
      },
      {
        title: "Examples of what the warning covers",
        bullets: [
          "A historical date that is off by one year but fits the surrounding story.",
          "A real paper title paired with a conclusion the paper did not make.",
          "A current product feature described from an older version.",
          "A correct general rule applied to the wrong country, contract, or account type.",
          "A calculation whose formula is reasonable but whose units or inputs are wrong.",
          "A recommendation that omits the strongest downside or competing interpretation.",
        ],
      },
      {
        title: "Why Makes Mistakes removes the hedge",
        paragraphs: [
          "The extension changes ‘can make mistakes’ to the direct ‘makes mistakes’ and highlights the line. The point is rhetorical: errors are not merely theoretical, so the reminder should be hard to mentally dismiss.",
          "It does not claim that every answer is wrong. It makes the existence of error salient enough that users remember to check the answers that matter.",
        ],
      },
      {
        title: "The shortest responsible workflow",
        steps: [
          {
            title: "Spot",
            body: "Mark the specific, current, cited, surprising, or consequential claim.",
          },
          {
            title: "Challenge",
            body: "Ask for assumptions, uncertainty, and evidence status.",
          },
          {
            title: "Verify",
            body: "Open an independent authoritative source and match it to the claim.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Does the disclaimer mean ChatGPT is unreliable for everything?",
        answer:
          "No. It can be very useful for drafting, explanation, and analysis. The disclaimer means you should calibrate trust and verify important external claims.",
      },
      {
        question: "Why does ChatGPT say ‘check important info’?",
        answer:
          "Because generated answers can contain incorrect or misleading details, including fabricated references, and the user remains responsible for consequential decisions.",
      },
      {
        question: "Can I remove the ChatGPT disclaimer?",
        answer:
          "Interface-modifying extensions can change how it is displayed, but hiding the reminder does not remove the underlying accuracy limitations.",
      },
    ],
    related: [
      "ai-disclaimer-rewriter",
      "chatgpt-makes-mistakes",
      "can-chatgpt-give-wrong-answers",
      "how-to-fact-check-chatgpt",
    ],
    sources: [sources.openAiAccuracy],
  },
  {
    slug: "can-chatgpt-make-up-citations",
    category: "Quick answer",
    title: "Can ChatGPT make up citations and sources?",
    seoTitle: "Can ChatGPT Make Up Citations? How to Check",
    description:
      "ChatGPT can fabricate citations, combine real details incorrectly, or cite a real source that does not support the claim. Use this check.",
    dek: "A reference can look academically complete and still be invented, mismatched, or impossible to verify.",
    quickAnswer:
      "Yes. ChatGPT can generate a non-existent paper, author, quotation, case, URL, or page number. It can also name a real source that does not support the sentence. Search the exact metadata, open the original, and match the relevant passage to the claim.",
    intent: "informational",
    published,
    modified: published,
    readingMinutes: 6,
    sections: [
      {
        title: "Four ways an AI citation can fail",
        cards: [
          {
            title: "Entirely fabricated",
            body: "The title, author, journal, case, report, quotation, or URL does not exist outside the generated answer.",
          },
          {
            title: "Real pieces, false combination",
            body: "The author and journal exist, but the title, year, volume, or conclusion belongs to something else.",
          },
          {
            title: "Real source, wrong support",
            body: "The linked page exists yet does not say what the answer attributes to it, or applies to another date or context.",
          },
          {
            title: "Uncheckable reference",
            body: "The answer omits enough metadata that the reader cannot identify the original work or relevant passage reliably.",
          },
        ],
      },
      {
        title: "Check a citation in five steps",
        steps: [
          {
            title: "Freeze the claim",
            body: "Copy the exact sentence the citation is supposed to support. Do not verify only the general topic.",
          },
          {
            title: "Search exact metadata",
            body: "Search the quoted title, author, publication, year, identifier, case number, or URL independently of the chat.",
          },
          {
            title: "Open the original",
            body: "Use the publisher, journal, court, regulator, standards body, repository, or official documentation page where possible.",
          },
          {
            title: "Match the passage",
            body: "Confirm that the source supports the exact claim, population, version, jurisdiction, time period, and degree of certainty.",
          },
          {
            title: "Record the result",
            body: "Mark the citation verified, mismatched, fabricated, outdated, or unresolved before reusing it.",
          },
        ],
      },
      {
        title: "Why a working link is not enough",
        paragraphs: [
          "A link proves only that a page exists. The answer may have selected a weak source, misunderstood the relevant passage, omitted a qualification, or attached the source to a stronger claim than it supports.",
          "For academic and professional work, verify the bibliographic details and the claim-to-passage relationship separately. A correct citation format cannot rescue incorrect attribution.",
        ],
      },
      {
        title: "Use ChatGPT to expose the weak spots",
        callout: {
          title: "Citation audit prompt",
          body: "List every citation and the exact claim it supports. For each one, provide complete metadata, say whether you actually opened the source, quote the relevant passage, and mark anything you cannot verify as uncertain. Do not invent a replacement citation.",
        },
        paragraphs: [
          "This prompt can produce a better audit trail, especially when search or supplied documents are available. It still does not replace opening the original source yourself because the model can misquote or misread the page during the audit.",
        ],
      },
      {
        title: "Where Makes Mistakes fits",
        paragraphs: [
          "The extension makes the provider warning harder to ignore and adds a fast re-check prompt after an answer. It does not inspect references or determine whether a source exists.",
          "Use the reminder to start the audit, then use bibliographic databases, official repositories, primary documents, and the original passage to finish it.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why does ChatGPT invent references?",
        answer:
          "It generates plausible language and metadata patterns. When the required source is missing from its available evidence, it may still complete the pattern with details that look credible.",
      },
      {
        question: "Can ChatGPT cite a real paper incorrectly?",
        answer:
          "Yes. A paper may be real while the title details, quotation, page number, method, population, or conclusion attributed to it is wrong.",
      },
      {
        question: "How do I verify a ChatGPT citation quickly?",
        answer:
          "Search the exact metadata, open the original publisher or repository page, and compare the relevant passage with the exact generated claim. Mark any mismatch explicitly.",
      },
      {
        question: "Should I cite ChatGPT as the source?",
        answer:
          "For external factual claims, cite the original evidence rather than treating the generated answer as the authority. Follow the citation rules of your institution or publisher for documenting AI use itself.",
      },
    ],
    related: [
      "how-to-fact-check-chatgpt",
      "can-chatgpt-fact-check-itself",
      "chatgpt-accuracy-guide",
      "chatgpt-for-research",
    ],
    sources: [sources.openAiAccuracy],
  },
]
