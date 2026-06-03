import type { AchievementDTO } from "@/lib/validations/content";

export const achievementsContent: AchievementDTO[] = [
  {
    id: "ach-publication-eggplant",
    title: "First-Author Publication in Data in Brief (Elsevier)",
    description:
      "Lead author of a peer-reviewed dataset paper publishing an open 4,089-image, six-class eggplant-leaf-disease benchmark for computer-vision research — a contribution to agricultural AI and precision farming.",
    type: "PUBLICATION",
    date: new Date("2025-04-01"),
    link: "/publications/eggplant-leaf-disease-dataset",
    order: 1,
  },
  {
    id: "ach-contest-cp",
    title: "Competitive Programming Contests",
    description:
      "Active participant in intra- and inter-university programming contests, sharpening algorithmic problem-solving under time pressure.",
    type: "CONTEST",
    date: new Date("2023-06-01"),
    link: null,
    order: 2,
  },
  {
    id: "ach-academic-cse",
    title: "Computer Science & Engineering",
    description:
      "Completed a CSE degree with a focus on machine learning, software engineering and research methodology.",
    type: "ACADEMIC",
    date: new Date("2023-12-01"),
    link: null,
    order: 3,
  },
  {
    id: "ach-award-projects",
    title: "Project Recognition",
    description:
      "Built and shipped university-adopted platforms (DIU Leaderboard, BusBuddy) used by the student community.",
    type: "AWARD",
    date: new Date("2023-03-01"),
    link: "/projects",
    order: 4,
  },
];
