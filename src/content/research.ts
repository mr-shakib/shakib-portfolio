import type { ResearchAreaDTO, ResearchEntryDTO } from "@/lib/validations/content";

export const researchAreasContent: ResearchAreaDTO[] = [
  {
    id: "machine-learning",
    slug: "machine-learning",
    title: "Machine Learning",
    description:
      "Designing and training models that learn from data — from classical methods to modern deep architectures.",
    icon: "brain",
    order: 1,
  },
  {
    id: "computer-vision",
    slug: "computer-vision",
    title: "Computer Vision",
    description:
      "Teaching machines to interpret images — classification, detection and segmentation for real-world problems.",
    icon: "eye",
    order: 2,
  },
  {
    id: "healthcare-ai",
    slug: "healthcare-ai",
    title: "Healthcare AI",
    description:
      "Applying machine learning to medical and health data to support diagnosis and decision-making.",
    icon: "heart-pulse",
    order: 3,
  },
  {
    id: "agricultural-ai",
    slug: "agricultural-ai",
    title: "Agricultural AI",
    description:
      "Precision agriculture through computer vision — crop-disease detection and yield optimization.",
    icon: "leaf",
    order: 4,
  },
  {
    id: "human-computer-interaction",
    slug: "human-computer-interaction",
    title: "Human-Computer Interaction",
    description:
      "Crafting interfaces and interactions that are intuitive, accessible and genuinely human-centered.",
    icon: "hand",
    order: 5,
  },
  {
    id: "data-science",
    slug: "data-science",
    title: "Data Science",
    description:
      "Turning raw data into insight through statistical analysis, visualization and reproducible pipelines.",
    icon: "chart",
    order: 6,
  },
];

export const researchEntriesContent: ResearchEntryDTO[] = [
  {
    id: "interest-cv-agri",
    type: "INTEREST",
    title: "Computer Vision for Agriculture",
    body: "Building robust, field-deployable models for crop-disease detection that work under real-world variability in lighting, occlusion and capture quality.",
    links: null,
    icon: "leaf",
    order: 1,
  },
  {
    id: "interest-healthcare",
    type: "INTEREST",
    title: "Trustworthy Healthcare AI",
    body: "Developing interpretable models for medical imaging and health data where reliability and explainability are prerequisites for adoption.",
    links: null,
    icon: "heart-pulse",
    order: 2,
  },
  {
    id: "current-eggplant",
    type: "CURRENT",
    title: "Eggplant Leaf Disease Classification",
    body: "Extending the published eggplant leaf-disease dataset with stronger augmentation strategies and transfer-learning baselines to push classification accuracy on minority disease classes.",
    links: null,
    icon: "microscope",
    order: 1,
  },
  {
    id: "past-baselines",
    type: "PAST",
    title: "Benchmark Dataset Construction",
    body: "Curated and openly released a labeled agricultural image dataset, establishing baseline CNN and transfer-learning results for reproducible research.",
    links: null,
    icon: "database",
    order: 1,
  },
  {
    id: "future-multimodal",
    type: "FUTURE",
    title: "Multimodal Crop-Health Monitoring",
    body: "Combining imagery with environmental and sensor data for earlier, more accurate detection of plant stress — a direction I aim to pursue at MSc level.",
    links: null,
    icon: "sparkles",
    order: 1,
  },
  {
    id: "dataset-eggplant",
    type: "DATASET",
    title: "Eggplant Leaf Disease Dataset",
    body: "An openly available, labeled image dataset of eggplant leaves across disease categories for machine-learning research.",
    links: [{ label: "View publication", href: "/publications/eggplant-leaf-disease-dataset" }],
    icon: "database",
    order: 1,
  },
  {
    id: "collab-open",
    type: "COLLABORATION",
    title: "Open to Collaboration",
    body: "Actively seeking research collaborations and MSc supervision in computer vision, agricultural AI and healthcare AI.",
    links: [{ label: "Get in touch", href: "/contact" }],
    icon: "users",
    order: 1,
  },
];
