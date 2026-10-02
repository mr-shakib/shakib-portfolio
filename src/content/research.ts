import type { ResearchAreaDTO, ResearchEntryDTO } from "@/lib/validations/content";

/** Formal research statement, shown as the page "abstract". */
export const researchStatement =
  "My research centres on trustworthy multimodal AI — systems that remain dependable when evidence is incomplete, conflicting, noisy, or collected under different real-world conditions. I am particularly interested in when models should make predictions, express uncertainty, or abstain, with an emphasis on biomedical and healthcare applications where reliability matters more than benchmark accuracy alone. I pair this with data-centric machine learning: building open datasets, careful evaluation protocols, and reproducible baselines, because the bottleneck in applied AI is rarely the architecture — it is the quality and honesty of the data and evaluation around it.";

/** Sidebar metadata block — academic profile facts. */
export const researchMeta: { label: string; value: string }[] = [
  { label: "Position", value: "Research Assistant · ICSETEP RDG, DIU" },
  { label: "Field", value: "Multimodal AI · Machine Learning" },
  { label: "Domains", value: "Healthcare · Accessibility · Agriculture" },
  { label: "Status", value: "Seeking advanced research opportunities" },
  { label: "Publications", value: "1 · Data in Brief (2025)" },
  { label: "Open to", value: "Collaboration & supervision" },
];

export const researchAreasContent: ResearchAreaDTO[] = [
  {
    id: "trustworthy-multimodal-ai",
    slug: "trustworthy-multimodal-ai",
    title: "Trustworthy Multimodal AI",
    description:
      "Systems that stay dependable when evidence is incomplete, conflicting, noisy or shifted — knowing when to predict, express uncertainty, or abstain.",
    icon: "brain",
    order: 1,
  },
  {
    id: "healthcare-biomedical-ai",
    slug: "healthcare-biomedical-ai",
    title: "Healthcare & Biomedical AI",
    description:
      "Machine learning for medical images and clinical context, prioritizing reliability, uncertainty estimation, external validation and responsible decision support.",
    icon: "heart-pulse",
    order: 2,
  },
  {
    id: "computer-vision",
    slug: "computer-vision",
    title: "Computer Vision",
    description:
      "Image classification, object detection and real-time vision systems for healthcare, accessibility and agriculture — from dataset development to deployment.",
    icon: "eye",
    order: 3,
  },
  {
    id: "data-centric-ml",
    slug: "data-centric-ml",
    title: "Data-Centric Machine Learning",
    description:
      "How dataset quality, label reliability, class balance and distribution shift affect model behaviour — building datasets and protocols for reproducible research.",
    icon: "chart",
    order: 4,
  },
  {
    id: "nlp-rag-agents",
    slug: "nlp-rag-agents",
    title: "NLP, RAG & AI Agents",
    description:
      "Grounded language systems that retrieve evidence before generating — document intelligence, citation-backed RAG, conversational agents, tool use and evaluation.",
    icon: "sparkles",
    order: 5,
  },
];

export const researchEntriesContent: ResearchEntryDTO[] = [
  {
    id: "interest-trustworthy-multimodal",
    type: "INTEREST",
    title: "Trustworthy Multimodal AI",
    body: "Understanding when multimodal models should make predictions, express uncertainty, or abstain — under missing, conflicting, noisy and distribution-shifted evidence.",
    links: null,
    icon: "brain",
    order: 1,
  },
  {
    id: "interest-healthcare",
    type: "INTEREST",
    title: "Reliable Healthcare AI",
    body: "Applying machine learning to medical images and clinical context with an emphasis on uncertainty estimation, external validation and responsible decision support.",
    links: null,
    icon: "heart-pulse",
    order: 2,
  },
  {
    id: "current-icsetep-counterfeit-medicine",
    type: "CURRENT",
    title: "AI & Post-Quantum Cryptography for Counterfeit Medicine Identification",
    body: "Research Assistant under the ICSETEP Research and Development Grant (RDG) at Daffodil International University, on the sub-project “Development and Effective Application of AI-Based, Post-Quantum Cryptography-Enabled Counterfeit Medicine Identification Tools for Better Treatment Outcomes in Bangladesh” — funded by the Asian Development Bank (ADB) and the Government of Bangladesh.",
    links: null,
    icon: "shield",
    order: 1,
  },
  {
    id: "current-multimodal-reliability",
    type: "CURRENT",
    title: "Reliability Under Clinical Missingness & Shift",
    body: "Working toward advanced research in reliable multimodal machine learning — clinical-context missingness, uncertainty quantification, selective prediction and cross-hospital distribution shift.",
    links: null,
    icon: "microscope",
    order: 2,
  },
  {
    id: "past-asl",
    type: "PAST",
    title: "Real-Time Sign-Language Recognition (Undergraduate Thesis)",
    body: "Designed an accessibility-focused system that recognizes ASL gestures from a live camera feed, assembles detected signs into text and synthesizes speech — combining YOLO-based detection, temporal smoothing and real-time inference.",
    links: [{ label: "View project", href: "/projects/asl-to-voice" }],
    icon: "eye",
    order: 1,
  },
  {
    id: "past-eggplant",
    type: "PAST",
    title: "Eggplant Leaf Disease Dataset (Data in Brief, 2025)",
    body: "Led the construction and open release of a 4,089-image, six-class eggplant-leaf dataset captured under varied field and lighting conditions — manually labelled and preprocessed for reproducible computer-vision research. Published in Elsevier's Data in Brief.",
    links: [{ label: "Read publication", href: "/publications/eggplant-leaf-disease-dataset" }],
    icon: "database",
    order: 2,
  },
  {
    id: "future-trustworthy-clinical",
    type: "FUTURE",
    title: "Dependable AI for High-Stakes Environments",
    body: "Contributing to AI systems that can operate responsibly in healthcare and other high-stakes settings — pairing multimodal modelling with rigorous evaluation of when systems should defer to humans.",
    links: null,
    icon: "sparkles",
    order: 1,
  },
  {
    id: "dataset-eggplant",
    type: "DATASET",
    title: "Eggplant Leaf Disease Dataset — 4,089 images, 6 classes",
    body: "An openly available, manually labelled image dataset of eggplant leaves spanning healthy specimens and five disease types (insect pest, leaf spot, mosaic virus, white mold, wilt), captured across multiple locations for reproducible machine-learning research.",
    links: [
      { label: "Publication", href: "/publications/eggplant-leaf-disease-dataset" },
      { label: "DOI ↗", href: "https://doi.org/10.1016/j.dib.2025.111353" },
    ],
    icon: "database",
    order: 1,
  },
  {
    id: "collab-open",
    type: "COLLABORATION",
    title: "Open to Collaboration",
    body: "Actively seeking research collaborations and supervision in trustworthy multimodal AI, healthcare AI, computer vision and grounded language systems.",
    links: [{ label: "Get in touch", href: "/contact" }],
    icon: "users",
    order: 1,
  },
];
