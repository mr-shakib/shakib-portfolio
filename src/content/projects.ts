import type { ProjectDTO } from "@/lib/validations/content";

/**
 * Canonical project content. Consumed directly by the DAL when no database is
 * configured, and used to seed the database when one is.
 */
export const projectsContent: ProjectDTO[] = [
  {
    id: "obelytics",
    slug: "obelytics",
    title: "Obelytics",
    summary:
      "A full-stack OBE and accreditation management platform for academic planning, attainment analysis and institutional reporting.",
    description:
      "Obelytics is a full-stack platform for managing outcome-based education and accreditation workflows. It centralizes programme outcomes, course outcomes, curriculum mapping, assessment data, faculty responsibilities, attainment calculations, reporting and evidence management. I designed and developed the platform architecture, backend services, database structure, role-based access controls, academic workflows and deployment pipeline.",
    category: "WEB",
    techStack: ["Next.js", "TypeScript", "FastAPI", "Python", "PostgreSQL", "Docker", "Railway", "Vercel"],
    tags: ["EdTech", "Full-Stack", "Analytics", "RBAC"],
    githubUrl: "https://github.com/mr-shakib/obelytics",
    demoUrl: "https://obelytics.vercel.app",
    coverImage: "/images/projects/obelytics.webp",
    screenshots: [],
    features: [
      "Programme- and course-outcome management with curriculum mapping",
      "Assessment data collection and attainment calculations",
      "Role-based access for administrators, faculty and reviewers",
      "Accreditation reporting and evidence management",
    ],
    challenges:
      "Modelling interconnected academic structures — outcomes, courses, assessments, evidence — while keeping attainment calculations correct and permissions airtight across roles.",
    results:
      "A deployed, production-style accreditation platform covering the full OBE workflow from outcome definition to attainment reporting.",
    featured: true,
    order: 1,
  },
  {
    id: "asl-to-voice",
    slug: "asl-to-voice",
    title: "ASL-to-Voice",
    summary:
      "Real-time sign-language recognition that turns live ASL gestures into text and speech for accessible communication.",
    description:
      "An accessibility-focused computer-vision system that recognizes American Sign Language gestures from a live camera feed, assembles detected signs into text, and converts the resulting text into speech. The project combines object detection, temporal smoothing, word construction and text-to-speech to support real-time communication between sign-language users and non-signers. Developed as my undergraduate thesis project.",
    category: "AI_ML",
    techStack: ["Python", "Ultralytics YOLO", "OpenCV", "PyTorch", "ONNX", "TensorFlow Lite", "Text-to-Speech"],
    tags: ["Computer Vision", "Accessibility", "Real-time", "Research"],
    githubUrl: "https://github.com/mr-shakib/ASL-to-Voice",
    demoUrl: null,
    coverImage: null,
    screenshots: [],
    features: [
      "Live-camera ASL gesture detection with YOLO",
      "Temporal smoothing for stable predictions",
      "Sign-to-text word construction",
      "Speech synthesis of assembled text",
    ],
    challenges:
      "Keeping detection stable and responsive on a live feed required temporal smoothing over noisy per-frame predictions and inference optimization across ONNX and TensorFlow Lite.",
    results:
      "A working end-to-end pipeline from camera input to spoken output, demonstrating real-time accessible communication.",
    featured: true,
    order: 2,
  },
  {
    id: "geoinsight",
    slug: "geoinsight",
    title: "GeoInsight",
    summary:
      "A real-time location-intelligence dashboard tracking 100+ simulated vehicles across Dhaka with live maps, clustering and heatmaps.",
    description:
      "GeoInsight is a production-style fleet-intelligence dashboard that tracks more than 100 simulated vehicles across Dhaka. It includes live position updates, marker clustering, status and regional filtering, route visualization, vehicle inspection, heatmaps and automatic polling fallback when sockets drop.",
    category: "WEB",
    techStack: ["Next.js 15", "TypeScript", "MapLibre GL", "Socket.IO", "Zustand", "TanStack Query", "Supercluster", "Deck.gl", "Tailwind CSS"],
    tags: ["Real-time", "Geospatial", "Dashboard"],
    githubUrl: "https://github.com/mr-shakib/geoinsight",
    demoUrl: "https://geoinsight-smoky.vercel.app",
    coverImage: "/images/projects/geoinsight.webp",
    screenshots: [],
    features: [
      "Live position updates for 100+ vehicles over WebSockets",
      "Marker clustering with status and regional filtering",
      "Route visualization, vehicle inspection and heatmaps",
      "Automatic polling fallback on connection loss",
    ],
    challenges:
      "Rendering a large, continuously updating fleet smoothly required clustering, careful state management and a resilient real-time layer with reconnection and polling fallbacks.",
    results:
      "A deployed, interactive fleet dashboard demonstrating production-grade real-time geospatial engineering.",
    featured: true,
    order: 3,
  },
  {
    id: "uniflow-ai",
    slug: "uniflow-ai",
    title: "UniFlow AI",
    summary:
      "An AI-powered university-admission ecosystem with an admission consultant, OCR form completion and an AI calling agent.",
    description:
      "UniFlow AI is an intelligent admission ecosystem designed to simplify the complete university-admission journey. It combines an admission consultant, OCR-based form completion, document verification, programme recommendations, applicant support, alumni connections and an AI calling agent capable of handling common admission enquiries. Developed by Team Code4Campus — which I led as team leader, system planner, AI-workflow designer and application developer — the project secured the runner-up position in the Student Service category of the DIU AI Project Competition 2026.",
    category: "MOBILE",
    techStack: ["Flutter", "Firebase", "Python", "FastAPI", "OCR", "LLM APIs", "RAG", "Speech-to-Text", "Text-to-Speech", "Telephony"],
    tags: ["AI Agents", "EdTech", "Award Winner", "RAG"],
    githubUrl: null,
    demoUrl: null,
    coverImage: null,
    screenshots: [],
    features: [
      "AI admission consultant with RAG-grounded answers",
      "OCR-based form completion and document verification",
      "Programme recommendations and applicant support",
      "AI calling agent for common admission enquiries",
    ],
    challenges:
      "Orchestrating OCR, retrieval, LLM reasoning, speech and telephony into one dependable admission workflow — under competition timelines and with a team to coordinate.",
    results:
      "Runner-up in the Student Service category of the DIU AI Project Competition 2026, among more than 145 participating teams.",
    featured: true,
    order: 4,
  },
  {
    id: "perfin",
    slug: "perfin",
    title: "Perfin",
    summary:
      "An AI-powered cross-platform personal-finance manager with budgets, forecasts and goal-feasibility analysis.",
    description:
      "Perfin is a cross-platform personal-finance application for tracking income, expenses, budgets, savings goals, recurring payments and spending patterns. It provides AI-assisted financial summaries, forecasts, personalized suggestions and goal-feasibility analysis through an integrated AI copilot.",
    category: "MOBILE",
    techStack: ["Flutter", "Dart", "Provider", "Hive", "Supabase", "Gemini AI", "FL Chart", "SharedPreferences"],
    tags: ["FinTech", "AI Copilot", "Mobile"],
    githubUrl: "https://github.com/mr-shakib/Perfin",
    demoUrl: null,
    coverImage: "/images/projects/perfin.webp",
    screenshots: [],
    features: [
      "Income, expense, budget and savings-goal tracking",
      "Recurring payments and spending-pattern analytics",
      "AI-assisted summaries, forecasts and suggestions",
      "Goal-feasibility analysis and local notifications",
    ],
    challenges:
      "Combining offline-first local persistence with cloud sync and AI-generated insights while keeping the experience fast and private.",
    results:
      "A polished personal-finance app demonstrating end-to-end Flutter architecture with an integrated AI copilot.",
    featured: false,
    order: 5,
  },
  {
    id: "immigrationbot",
    slug: "immigrationbot",
    title: "ImmigrationBot",
    summary:
      "A citation-grounded RAG assistant built over 467 USCIS documents, with speech input and output.",
    description:
      "ImmigrationBot is a retrieval-augmented conversational assistant built over 467 USCIS documents. It retrieves relevant source material, generates grounded responses and presents citations so users can verify information against official documents. The system also supports speech input and output, making complex immigration information easier to explore through a conversational interface.",
    category: "AI_ML",
    techStack: ["Python", "FastAPI", "LangChain", "ChromaDB", "Groq", "Llama 3.3", "Embeddings", "Speech-to-Text", "Text-to-Speech"],
    tags: ["RAG", "NLP", "GovTech", "Conversational AI"],
    githubUrl: null,
    demoUrl: null,
    coverImage: null,
    screenshots: [],
    features: [
      "Embedding-based retrieval over 467 USCIS documents",
      "Grounded generation with visible citations",
      "Speech input and spoken responses",
      "Verifiable answers traceable to official sources",
    ],
    challenges:
      "Ensuring every generated answer stayed traceable to official source passages — prioritizing citation fidelity over fluent-but-ungrounded responses.",
    results:
      "A citation-first assistant that makes dense government documentation explorable through conversation.",
    featured: false,
    order: 6,
  },
];
