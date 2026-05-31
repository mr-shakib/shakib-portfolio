import type { SkillDTO } from "@/lib/validations/content";

/** Powers both the 3D skills graph and its accessible HTML fallback. */
export const skillsContent: SkillDTO[] = [
  // Programming
  { name: "Python", category: "Programming", level: 92, description: "Primary language for ML & research." },
  { name: "TypeScript", category: "Programming", level: 90, description: "Type-safe full-stack development." },
  { name: "JavaScript", category: "Programming", level: 88 },
  { name: "C++", category: "Programming", level: 80, description: "Competitive programming & systems." },
  { name: "SQL", category: "Programming", level: 82 },

  // Frontend
  { name: "React", category: "Frontend", level: 90 },
  { name: "Next.js", category: "Frontend", level: 88, description: "App Router, RSC, SSR/ISR." },
  { name: "Tailwind CSS", category: "Frontend", level: 88 },
  { name: "Three.js", category: "Frontend", level: 72, description: "WebGL & interactive 3D." },
  { name: "GSAP", category: "Frontend", level: 78 },

  // Backend
  { name: "Node.js", category: "Backend", level: 84 },
  { name: "Express", category: "Backend", level: 80 },
  { name: "FastAPI", category: "Backend", level: 78 },
  { name: "Prisma", category: "Backend", level: 82 },
  { name: "PostgreSQL", category: "Backend", level: 80 },

  // AI/ML
  { name: "PyTorch", category: "AI/ML", level: 82 },
  { name: "TensorFlow", category: "AI/ML", level: 76 },
  { name: "scikit-learn", category: "AI/ML", level: 85 },
  { name: "OpenCV", category: "AI/ML", level: 80, description: "Computer vision pipelines." },
  { name: "Pandas / NumPy", category: "AI/ML", level: 88 },

  // Research
  { name: "Experiment Design", category: "Research", level: 80 },
  { name: "Dataset Curation", category: "Research", level: 85 },
  { name: "Technical Writing", category: "Research", level: 82 },
  { name: "Statistical Analysis", category: "Research", level: 78 },

  // Cloud
  { name: "Vercel", category: "Cloud", level: 85 },
  { name: "Docker", category: "Cloud", level: 74 },
  { name: "Git / CI", category: "Cloud", level: 86 },
];

export const skillCategories = [
  "Programming",
  "Frontend",
  "Backend",
  "AI/ML",
  "Research",
  "Cloud",
] as const;
