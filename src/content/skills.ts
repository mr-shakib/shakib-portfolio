import type { SkillDTO } from "@/lib/validations/content";

/** Powers both the 3D skills graph and its accessible HTML fallback. */
export const skillsContent: SkillDTO[] = [
  // Mobile & cross-platform
  {
    name: "Flutter & Dart",
    category: "Mobile",
    level: 92,
    description:
      "Production cross-platform apps: state management, API integration, deep linking, real-time communication, notifications and deployment.",
  },
  {
    name: "Firebase",
    category: "Mobile",
    level: 85,
    description:
      "Authentication, Firestore, Cloud Storage, Cloud Messaging, hosting, security rules and FlutterFire integration.",
  },
  {
    name: "Mobile Architecture",
    category: "Mobile",
    level: 84,
    description:
      "Feature-based architecture, repository patterns, offline-first workflows, dependency injection and reusable components.",
  },

  // AI & machine learning
  {
    name: "Python",
    category: "AI/ML",
    level: 92,
    description:
      "ML experimentation, backend development, data processing, automation, evaluation pipelines and research implementation.",
  },
  {
    name: "Machine Learning",
    category: "AI/ML",
    level: 84,
    description:
      "Supervised & unsupervised learning, feature engineering, model evaluation, experiment design and reproducible workflows.",
  },
  {
    name: "Computer Vision",
    category: "AI/ML",
    level: 84,
    description:
      "Image classification, object detection, transfer learning, YOLO, dataset preparation and real-time vision systems.",
  },
  {
    name: "NLP & RAG",
    category: "AI/ML",
    level: 82,
    description:
      "Document processing, embedding-based retrieval, vector databases, grounded generation, citation pipelines and conversational AI.",
  },
  {
    name: "Trustworthy Multimodal AI",
    category: "AI/ML",
    level: 76,
    description:
      "Research focus: reliability under missing, conflicting, noisy and distribution-shifted evidence — particularly for biomedical applications.",
  },

  // Web & backend engineering
  {
    name: "FastAPI",
    category: "Web & Backend",
    level: 82,
    description:
      "REST APIs, validation, authentication, asynchronous services, database integration and AI-model serving.",
  },
  {
    name: "Next.js & TypeScript",
    category: "Web & Backend",
    level: 82,
    description:
      "Server & client components, typed interfaces, API routes, dashboards and production deployment.",
  },
  {
    name: "Databases",
    category: "Web & Backend",
    level: 82,
    description:
      "PostgreSQL, MySQL, SQLite, Firestore, Hive, ChromaDB — modelling, migrations, indexing and query design.",
  },
  {
    name: "Real-Time Systems",
    category: "Web & Backend",
    level: 80,
    description:
      "WebSockets, Socket.IO, live data synchronization, reconnection handling and polling fallbacks.",
  },

  // Tools & platforms
  {
    name: "Git & GitHub",
    category: "Tools & Platforms",
    level: 90,
    description:
      "Branching, pull requests, code review, issue tracking and collaborative development.",
  },
  {
    name: "Docker",
    category: "Tools & Platforms",
    level: 80,
    description:
      "Containerized development environments, service configuration and reproducible setups.",
  },
  {
    name: "Cloud Deployment",
    category: "Tools & Platforms",
    level: 80,
    description:
      "Vercel, Railway, Render, Firebase — environment configuration, logging and basic CI/CD workflows.",
  },
  {
    name: "Research Tools",
    category: "Tools & Platforms",
    level: 82,
    description:
      "Pandas, NumPy, Scikit-learn, PyTorch, Ultralytics YOLO, Matplotlib, Jupyter and Google Colab.",
  },
];

export const skillCategories = ["Mobile", "AI/ML", "Web & Backend", "Tools & Platforms"] as const;
