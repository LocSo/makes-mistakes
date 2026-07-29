import { published, sources, type ContentPage } from "../content-page-types"

export const pages11: ContentPage[] = [
  {
    slug: "chatgpt-for-research",
    category: "Use case",
    title: "How to use ChatGPT for research without treating it as a source",
    seoTitle: "How to Use ChatGPT for Research Responsibly",
    description:
      "Use ChatGPT for research framing, query design, document analysis, and synthesis while preserving source boundaries and verification.",
    dek: "The productive role is research assistant, not uncited authority.",
    quickAnswer:
      "Use ChatGPT to refine questions, generate search terms, structure evidence, compare supplied documents, and identify gaps. Cite and verify the original sources—not the model's unsupported memory.",
    intent: "informational",
    published,
    modified: published,
    readingMinutes: 9,
    sections: [
      {
        title: "Good research jobs for ChatGPT",
        cards: [
          {
            title: "Question framing",
            body: "Turn a broad topic into answerable subquestions, definitions, time windows, and inclusion criteria.",
          },
          {
            title: "Search design",
            body: "Generate synonyms, controlled vocabulary, competing terminology, and database query variants.",
          },
          {
            title: "Document extraction",
            body: "Pull claims, methods, limitations, entities, and disagreements from material you provide.",
          },
          {
            title: "Evidence matrix",
            body: "Organize sources by claim, method, population, result, limitation, and relevance.",
          },
          {
            title: "Counterargument search",
            body: "Identify what evidence would challenge the emerging conclusion and where to look for it.",
          },
          {
            title: "Draft structure",
            body: "Outline a report after the evidence has been collected and labeled.",
          },
        ],
      },
      {
        title: "A source-safe workflow",
        steps: [
          {
            title: "Define the research question",
            body: "Record scope, decision, date range, geography, population, and what would count as an answer.",
          },
          {
            title: "Build the search plan",
            body: "Use the model for terminology, then run searches in appropriate databases and official repositories.",
          },
          {
            title: "Save the originals",
            body: "Capture stable URLs, files, dates, authors, versions, and page or section references.",
          },
          {
            title: "Give the model bounded evidence",
            body: "Tell it to distinguish supplied text from background knowledge and to return ‘not in source’ instead of guessing.",
          },
          {
            title: "Audit every synthesized claim",
            body: "Map the draft sentence back to the source passages and preserve disagreement and limitations.",
          },
        ],
      },
      {
        title: "Citation rules",
        bullets: [
          "Never cite ChatGPT as though it were the original evidence for an external fact.",
          "Do not trust generated bibliographies until every item is located and read.",
          "Keep quotations exact and attach a page, section, paragraph, or timestamp.",
          "Separate what a source reports from your interpretation of its significance.",
          "Record access date and version for changing online material.",
        ],
      },
      {
        title: "Research prompt template",
        callout: {
          title: "Bounded document review",
          body: "Use only the supplied documents for factual claims. For each conclusion, quote the supporting passage and identify the source and page or section. Label any background knowledge separately. If the documents conflict or do not answer the question, say so. Do not invent missing references.",
        },
      },
      {
        title: "Where a reminder helps",
        paragraphs: [
          "Research sessions reward momentum. That makes a subtle footer warning easy to ignore precisely when the answer is long and polished. Makes Mistakes keeps the limitation visible and puts a challenge prompt next to the composer.",
          "The real safeguard remains provenance: a claim-evidence map that survives outside the chat.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I use ChatGPT for academic research?",
        answer:
          "It can assist with framing, search terms, extraction, and organization. Follow your institution's AI policy, protect sensitive material, and verify and cite the original sources.",
      },
      {
        question: "Can ChatGPT find research papers?",
        answer:
          "Search-enabled tools can suggest papers, but generated references can be wrong. Locate each paper in a trusted database and read it before citing it.",
      },
      {
        question: "How do I stop ChatGPT inventing sources?",
        answer:
          "Provide bounded source material, require exact passage references, allow ‘not found,’ and independently verify every bibliographic item. No prompt can guarantee zero fabrication.",
      },
    ],
    related: [
      "chatgpt-for-students",
      "how-to-fact-check-chatgpt",
      "ai-hallucinations-guide",
      "chatgpt-accuracy-guide",
    ],
    sources: [sources.openAiAccuracy],
  },
  {
    slug: "chatgpt-for-students",
    category: "Use case",
    title: "How students can use ChatGPT without outsourcing the learning",
    seoTitle: "How Students Can Use ChatGPT Responsibly",
    description:
      "A practical student workflow for explanations, practice, feedback, research, citation checks, and academic-integrity boundaries.",
    dek: "Use the model to increase the number of thinking cycles—not to remove the student's thinking from the assignment.",
    quickAnswer:
      "Use ChatGPT for tutoring, examples, practice questions, feedback, and planning. Keep authorship, source checking, calculations, and final judgment with the student, and follow the class or institution's AI policy.",
    intent: "informational",
    published,
    modified: published,
    readingMinutes: 8,
    sections: [
      {
        title: "High-value student uses",
        cards: [
          {
            title: "Explain at a different level",
            body: "Ask for an analogy, a prerequisite refresher, then a more technical explanation and compare them with the textbook.",
          },
          {
            title: "Generate practice",
            body: "Create questions without answers first, attempt them, then request feedback on the reasoning.",
          },
          {
            title: "Find gaps",
            body: "Paste your own outline and ask which claims need evidence, definitions, examples, or counterarguments.",
          },
          {
            title: "Get formative feedback",
            body: "Ask for questions and a rubric-based critique rather than a replacement submission.",
          },
          {
            title: "Plan study sessions",
            body: "Turn a syllabus into spaced review blocks, then adjust based on actual performance.",
          },
          {
            title: "Practice oral defense",
            body: "Have the model challenge your claims so you can explain the evidence in your own words.",
          },
        ],
      },
      {
        title: "A learning-preserving workflow",
        steps: [
          {
            title: "Try first",
            body: "Write the initial explanation, solve the problem, or build the outline before seeing a generated answer.",
          },
          {
            title: "Ask for feedback, not substitution",
            body: "Request hints, questions, error diagnosis, or rubric comparison while preserving your authorship.",
          },
          {
            title: "Verify the facts and citations",
            body: "Use course material, original sources, and approved databases. Never submit a generated citation you have not opened.",
          },
          {
            title: "Explain the result unaided",
            body: "Close the chat and reproduce the reasoning. If you cannot, the tool completed the task but you did not learn it yet.",
          },
          {
            title: "Disclose as required",
            body: "Follow the instructor's policy for permitted use, attribution, process notes, and prohibited assistance.",
          },
        ],
      },
      {
        title: "Red flags",
        bullets: [
          "Submitting prose you cannot defend or explain.",
          "Citing a source that you have not opened.",
          "Using generated calculations without reproducing them.",
          "Letting the model flatten a contested topic into one confident view.",
          "Uploading private student, patient, client, research, or assessment data without authorization.",
          "Ignoring a course rule because the result was edited afterward.",
        ],
      },
      {
        title: "A better tutoring prompt",
        callout: {
          title: "Socratic mode",
          body: "Do not give me the final answer yet. Ask one diagnostic question at a time, identify the first step where my reasoning fails, and give the smallest hint that lets me continue. After I finish, create one transfer problem that tests the same concept in a new setting.",
        },
      },
    ],
    faqs: [
      {
        question: "Is using ChatGPT cheating?",
        answer:
          "It depends on the task and the applicable policy. Using it may be permitted for tutoring or feedback and prohibited for generating assessed work. Ask the instructor when the rule is unclear.",
      },
      {
        question: "Can students trust ChatGPT citations?",
        answer:
          "No citation should be trusted until the student locates the original, confirms the metadata and passage, and checks that it supports the claim.",
      },
      {
        question: "How can ChatGPT help me study instead of doing the work?",
        answer:
          "Use it for diagnostic questions, hints, practice, counterexamples, and feedback after your attempt. Require it to delay the final answer.",
      },
    ],
    related: [
      "chatgpt-for-research",
      "how-to-fact-check-chatgpt",
      "can-chatgpt-give-wrong-answers",
      "chatgpt-accuracy-guide",
    ],
    sources: [sources.openAiAccuracy],
  },
]
