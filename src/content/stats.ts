import type { StatDTO } from "@/lib/validations/content";

/** Derived where possible from real content; counters animate to these values. */
export const statsContent: StatDTO[] = [
  { label: "Publications", value: 1, suffix: "" },
  { label: "Projects Shipped", value: 5, suffix: "+" },
  { label: "Technologies", value: 25, suffix: "+" },
  { label: "Research Areas", value: 6, suffix: "" },
  { label: "Years Coding", value: 5, suffix: "+" },
];

export const heroRoles = ["Researcher", "Developer", "AI Enthusiast", "Problem Solver"] as const;

/** Short personal narrative shown alongside the journey timeline. */
export const aboutBio =
  "I’m a Computer Science & Engineering graduate from Daffodil International University, where I finished with a 3.92 CGPA. My path runs through two passions that keep converging: rigorous research and building software people actually use. A plant-disease project pulled me deep into computer vision and machine learning — and led to my first peer-reviewed publication in Elsevier’s Data in Brief. Alongside research I’ve shipped full-stack platforms adopted by my university community. Next, I’m pursuing an MSc in Computer Science focused on AI and machine learning, with the long-term goal of a PhD and a research career.";

export const aboutTimeline = [
  {
    stage: "2022 — 2026",
    role: "Student",
    title: "B.Sc. in Computer Science & Engineering",
    body: "Graduated from Daffodil International University with a 3.92 CGPA, building strong foundations in algorithms, software engineering and the mathematics behind machine learning.",
  },
  {
    stage: "2025",
    role: "Researcher",
    title: "First-Author Publication, Data in Brief",
    body: "Led the construction and open release of a 4,089-image, six-class eggplant-leaf-disease dataset — peer-reviewed and published in Elsevier’s Data in Brief, contributing an open benchmark to agricultural AI.",
  },
  {
    stage: "2023 — Present",
    role: "Developer",
    title: "Full-Stack Software Builder",
    body: "Designed and shipped end-to-end platforms — including DIU Leaderboard and BusBuddy — adopted by the university community, turning real problems into production software.",
  },
  {
    stage: "Next",
    role: "Future Academic",
    title: "MSc → PhD in AI & Machine Learning",
    body: "Pursuing an MSc in Computer Science focused on AI and machine learning, with a PhD ambition and a research direction centred on computer vision for agriculture and healthcare.",
  },
] as const;
