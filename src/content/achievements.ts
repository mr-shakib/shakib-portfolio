import type { AchievementDTO } from "@/lib/validations/content";

export const achievementsContent: AchievementDTO[] = [
  {
    id: "ach-runner-up-diu-ai",
    title: "Runner-Up, DIU AI Project Competition 2026",
    description:
      "Led Team Code4Campus in developing UniFlow AI, an intelligent university-admission ecosystem — securing the runner-up position in the Student Service category among more than 145 participating teams.",
    type: "CONTEST",
    date: new Date("2026-04-01"),
    link: "/projects/uniflow-ai",
    order: 1,
  },
  {
    id: "ach-obelytics",
    title: "Began Building Obelytics",
    description:
      "Started developing an OBE and accreditation management platform for academic planning, outcome mapping, attainment analysis, evidence management and institutional reporting.",
    type: "PROJECT",
    date: new Date("2026-05-01"),
    link: "/projects/obelytics",
    order: 2,
  },
  {
    id: "ach-flexloop",
    title: "Software Engineer at Flexloop",
    description:
      "Became a professional software engineer, working on production Flutter features, API integration, AI-assisted functionality, testing, debugging and collaborative software delivery.",
    type: "CAREER",
    date: new Date("2026-02-01"),
    link: null,
    order: 3,
  },
  {
    id: "ach-graduation",
    title: "B.Sc. in Computer Science & Engineering — CGPA 3.92/4.00",
    description:
      "Graduated from Daffodil International University with a 3.92 out of 4.00 CGPA, completing a degree focused on software engineering, machine learning and research.",
    type: "ACADEMIC",
    date: new Date("2026-01-01"),
    link: null,
    order: 4,
  },
  {
    id: "ach-techjays",
    title: "Software Engineer Intern at Techjays",
    description:
      "Worked on production Flutter Web features — navigation architecture, deep linking, browser-history handling, AI voice interactions and reconnection logic. Recognized for ownership and contribution during the internship.",
    type: "CAREER",
    date: new Date("2025-07-01"),
    link: null,
    order: 5,
  },
  {
    id: "ach-publication-eggplant",
    title: "First Peer-Reviewed Publication in Data in Brief (Elsevier)",
    description:
      "First author of a dataset article releasing 4,089 labelled eggplant-leaf images across six classes for open computer-vision research in plant pathology and precision agriculture.",
    type: "PUBLICATION",
    date: new Date("2025-04-01"),
    link: "/publications/eggplant-leaf-disease-dataset",
    order: 6,
  },
  {
    id: "ach-asl-thesis",
    title: "Accessibility-Focused Thesis: Real-Time Sign-Language Recognition",
    description:
      "Designed a real-time sign-language recognition and speech-synthesis system as an undergraduate thesis — combining computer vision, real-time inference and accessibility-oriented problem solving.",
    type: "PROJECT",
    date: new Date("2024-09-01"),
    link: "/projects/asl-to-voice",
    order: 7,
  },
  {
    id: "ach-journey-start",
    title: "Began the Software & AI Journey",
    description:
      "Started building a foundation in computer science, programming, problem-solving, application development and machine learning — with early projects across mobile apps, web systems and practical university tools.",
    type: "ACADEMIC",
    date: new Date("2021-06-01"),
    link: null,
    order: 8,
  },
];
