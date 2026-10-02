import type { StatDTO } from "@/lib/validations/content";

/** Derived where possible from real content; counters animate to these values. */
export const statsContent: StatDTO[] = [
  { label: "Peer-Reviewed Publication", value: 1, suffix: "" },
  { label: "Software & AI Projects", value: 10, suffix: "+" },
  { label: "Dataset Images Published", value: 4089, suffix: "" },
  { label: "Years in Industry", value: 1, suffix: "+" },
  { label: "Undergraduate CGPA", value: 3.92, suffix: " / 4.00" },
  { label: "Core Focus Areas", value: 6, suffix: "" },
];

export const heroRoles = [
  "Software Engineer",
  "AI Researcher",
  "Flutter Developer",
  "Problem Solver",
] as const;

/** Short personal narrative shown alongside the journey timeline. */
export const aboutBio =
  "I’m Shakib Howlader, a software engineer and AI researcher with a background in computer science, mobile development, and applied machine learning. My work spans Flutter applications, intelligent web systems, computer vision, natural language processing, and AI-powered platforms designed to solve practical problems. I’m driven by the challenge of turning complex ideas into reliable, useful products — working at the intersection of research and engineering, where strong technical foundations, thoughtful design, and real-world impact matter equally. I’m currently advancing my research in trustworthy multimodal AI while continuing to build scalable software systems, with the long-term goal of contributing to AI that is dependable, accessible, and meaningful.";

/** Compact fact list rendered beneath the bio in the About section. */
export const quickFacts = [
  { label: "Experience", value: "1+ year in professional software engineering" },
  { label: "Focus Areas", value: "Flutter · AI/ML · Computer Vision · NLP · RAG · Full-Stack" },
  { label: "Research Interests", value: "Trustworthy multimodal AI & reliable machine learning" },
  { label: "Languages", value: "Bangla & English" },
  { label: "Current Goal", value: "Impactful AI systems & advanced research opportunities" },
] as const;

export const aboutTimeline = [
  {
    stage: "2021 — 2026",
    role: "Student",
    title: "B.Sc. in Computer Science & Engineering",
    body: "Graduated from Daffodil International University with a 3.92 / 4.00 CGPA, building strong foundations in algorithms, software engineering, mobile development and applied machine learning.",
  },
  {
    stage: "2025",
    role: "Researcher",
    title: "First-Author Publication, Data in Brief",
    body: "Led the construction and open release of a 4,089-image, six-class eggplant-leaf-disease dataset — peer-reviewed and published in Elsevier’s Data in Brief, contributing an open benchmark to agricultural AI.",
  },
  {
    stage: "2025 — Present",
    role: "Engineer",
    title: "Software Engineer, Techjays → Flexloop",
    body: "From a production Flutter internship at Techjays — recognized for ownership and contribution — to professional engineering at Flexloop, shipping Flutter features, API integrations and AI-assisted functionality.",
  },
  {
    stage: "2026 — Present",
    role: "Research Assistant",
    title: "Research Assistant, ICSETEP RDG at DIU",
    body: "Appointed under the ICSETEP Research and Development Grant to build AI-based, post-quantum-cryptography-enabled tools that identify counterfeit medicine in Bangladesh — funded by the Asian Development Bank and the Government of Bangladesh.",
  },
  {
    stage: "Next",
    role: "Future Academic",
    title: "Trustworthy Multimodal AI Research",
    body: "Working toward advanced research in reliable multimodal machine learning — clinical-context missingness, uncertainty, selective prediction and cross-hospital distribution shift — for AI that operates responsibly in high-stakes environments.",
  },
] as const;
