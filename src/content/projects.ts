import type { ProjectDTO } from "@/lib/validations/content";

/**
 * Canonical project content. Consumed directly by the DAL when no database is
 * configured, and used to seed the database when one is.
 */
export const projectsContent: ProjectDTO[] = [
  {
    id: "diu-leaderboard",
    slug: "diu-leaderboard",
    title: "DIU Leaderboard",
    summary:
      "A competitive programming leaderboard aggregating ratings across judges for university students.",
    description:
      "DIU Leaderboard unifies competitive-programming performance across multiple online judges into a single ranked view for Daffodil International University students. It periodically syncs ratings, normalizes scores across platforms, and renders an animated, filterable leaderboard. Built to motivate consistent practice and surface rising talent.",
    category: "WEB",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "Cron"],
    tags: ["Competitive Programming", "Dashboard", "Data Aggregation"],
    githubUrl: "https://github.com/",
    demoUrl: null,
    coverImage: null,
    screenshots: [],
    features: [
      "Cross-judge rating aggregation and normalization",
      "Scheduled background sync jobs",
      "Filter, search and sort across thousands of profiles",
      "Animated rank transitions",
    ],
    challenges:
      "Reconciling inconsistent rating scales and rate-limited APIs across multiple judges required a normalization model and a resilient, incremental sync pipeline.",
    results:
      "Adopted by the university programming community as the reference ranking, driving measurable increases in weekly practice activity.",
    featured: true,
    order: 1,
  },
  {
    id: "diu-busbuddy",
    slug: "diu-busbuddy",
    title: "DIU BusBuddy",
    summary:
      "Real-time campus bus tracking and scheduling app that removes the guesswork from daily commutes.",
    description:
      "BusBuddy gives students live locations, ETAs and schedules for university transport. It combines GPS tracking with a clean schedule interface and push notifications for departures, dramatically reducing wait times and missed buses.",
    category: "MOBILE",
    techStack: ["React Native", "Node.js", "Express", "MongoDB", "Socket.IO", "Google Maps API"],
    tags: ["Real-time", "Geolocation", "Mobile"],
    githubUrl: "https://github.com/",
    demoUrl: null,
    coverImage: null,
    screenshots: [],
    features: [
      "Live GPS bus tracking with ETA prediction",
      "Route and schedule browser",
      "Departure push notifications",
      "Offline-friendly schedule cache",
    ],
    challenges:
      "Maintaining accurate real-time positions over unreliable mobile networks demanded efficient socket usage and client-side dead-reckoning between updates.",
    results:
      "Cut average reported wait times and became a daily-driver utility for commuting students.",
    featured: true,
    order: 2,
  },
  {
    id: "prism",
    slug: "prism",
    title: "Prism",
    summary:
      "An interactive data-visualization toolkit that turns complex datasets into explorable visual narratives.",
    description:
      "Prism is a visualization toolkit for exploring multidimensional research data. It provides composable charts, dimensionality-reduction views and an interactive explorer, letting researchers move from raw CSVs to insight without writing plotting code.",
    category: "AI_ML",
    techStack: ["React", "D3.js", "TypeScript", "Python", "FastAPI", "scikit-learn"],
    tags: ["Data Science", "Visualization", "Research Tooling"],
    githubUrl: "https://github.com/",
    demoUrl: null,
    coverImage: null,
    screenshots: [],
    features: [
      "Composable, animated chart primitives",
      "PCA / t-SNE dimensionality-reduction views",
      "Interactive filtering and brushing",
      "Export to publication-ready figures",
    ],
    challenges:
      "Rendering large datasets interactively required virtualized canvas rendering and careful memoization to keep interactions at 60fps.",
    results:
      "Accelerated exploratory analysis for research datasets, reducing time-to-first-insight.",
    featured: true,
    order: 3,
  },
  {
    id: "schedulearn",
    slug: "schedulearn",
    title: "ScheduLearn",
    summary:
      "An adaptive study-scheduling platform that plans revision using spaced-repetition principles.",
    description:
      "ScheduLearn builds personalized study plans from a student's courses, deadlines and confidence levels, applying spaced-repetition scheduling to maximize retention. It adapts daily as the learner reports progress.",
    category: "WEB",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "Zod"],
    tags: ["EdTech", "Spaced Repetition", "Productivity"],
    githubUrl: "https://github.com/",
    demoUrl: null,
    coverImage: null,
    screenshots: [],
    features: [
      "Spaced-repetition scheduling engine",
      "Adaptive daily planning",
      "Progress analytics and streaks",
      "Calendar integration",
    ],
    challenges:
      "Designing a scheduling algorithm that balanced upcoming deadlines against long-term retention required a tunable priority model.",
    results: "Helped students distribute study load and improve retention before assessments.",
    featured: false,
    order: 4,
  },
  {
    id: "student-management-system",
    slug: "student-management-system",
    title: "Student Management System",
    summary:
      "A full-stack administration platform for managing students, courses, enrollment and results.",
    description:
      "A comprehensive student management system handling enrollment, course management, attendance, grading and reporting with role-based access for administrators, faculty and students.",
    category: "SYSTEM",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "NextAuth", "Tailwind CSS"],
    tags: ["Full-Stack", "RBAC", "CRUD"],
    githubUrl: "https://github.com/",
    demoUrl: null,
    coverImage: null,
    screenshots: [],
    features: [
      "Role-based access control",
      "Enrollment and course management",
      "Attendance and grade tracking",
      "Report generation",
    ],
    challenges:
      "Modeling complex institutional relationships while keeping permissions correct across roles required a carefully normalized schema.",
    results: "Streamlined administrative workflows that were previously manual and spreadsheet-bound.",
    featured: false,
    order: 5,
  },
];
