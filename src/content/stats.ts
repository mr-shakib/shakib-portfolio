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

export const aboutTimeline = [
  {
    stage: "Student",
    title: "Computer Science Engineer",
    body: "Grounded in algorithms, software engineering and the mathematics behind machine learning.",
  },
  {
    stage: "Researcher",
    title: "Publication Author",
    body: "Curated and published an open dataset for agricultural image classification.",
  },
  {
    stage: "Developer",
    title: "Software Builder",
    body: "Shipped full-stack platforms adopted by a real university community.",
  },
  {
    stage: "Future Academic",
    title: "MSc Applicant & Researcher",
    body: "Pursuing graduate research in computer vision, healthcare and agricultural AI.",
  },
] as const;
