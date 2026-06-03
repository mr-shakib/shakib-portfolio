import type { ResearchAreaDTO, ResearchEntryDTO } from "@/lib/validations/content";

/** Formal research statement, shown as the page "abstract". */
export const researchStatement =
  "My research sits at the intersection of computer vision, machine learning and their application to high-stakes, data-scarce domains — principally agriculture and healthcare. I am interested in models that remain robust under real-world variability, that are interpretable enough to be trusted by domain experts, and that are released alongside open, reproducible datasets. I believe the bottleneck in applied AI is rarely the architecture; it is the quality, availability and honesty of the data and evaluation around it. My work therefore pairs model development with careful dataset construction and reproducible baselines.";

/** Sidebar metadata block — academic profile facts. */
export const researchMeta: { label: string; value: string }[] = [
  { label: "Field", value: "Computer Vision · Machine Learning" },
  { label: "Domains", value: "Agriculture · Healthcare" },
  { label: "Status", value: "Seeking MSc & research roles" },
  { label: "Publications", value: "1 · Data in Brief (2025)" },
  { label: "Open to", value: "Collaboration & supervision" },
];

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
    body: "Building on our published six-class dataset of 4,089 eggplant-leaf images to develop stronger augmentation strategies and transfer-learning baselines that improve classification accuracy on harder disease classes such as mosaic virus and wilt.",
    links: [{ label: "View dataset paper", href: "/publications/eggplant-leaf-disease-dataset" }],
    icon: "microscope",
    order: 1,
  },
  {
    id: "past-baselines",
    type: "PAST",
    title: "Eggplant Leaf Disease Dataset (Data in Brief, 2025)",
    body: "Led the construction and open release of a 4,089-image, six-class eggplant-leaf dataset captured under varied field and lighting conditions — manually labelled and preprocessed for reproducible computer-vision research. Published in Elsevier's Data in Brief.",
    links: [{ label: "Read publication", href: "/publications/eggplant-leaf-disease-dataset" }],
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
    title: "Eggplant Leaf Disease Dataset — 4,089 images, 6 classes",
    body: "An openly available, manually labelled image dataset of eggplant leaves spanning healthy specimens and five disease types (insect pest, leaf spot, mosaic virus, white mold, wilt), captured across multiple locations for reproducible machine-learning research.",
    links: [
      { label: "Publication", href: "/publications/eggplant-leaf-disease-dataset" },
      { label: "DOI ↗", href: "https://doi.org/10.1016/j.dib.2025.111353" },
    ],
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
