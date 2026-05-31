import type { PublicationDTO } from "@/lib/validations/content";

export const publicationsContent: PublicationDTO[] = [
  {
    id: "eggplant-leaf-disease-dataset",
    slug: "eggplant-leaf-disease-dataset",
    title:
      "Eggplant Leaf Disease Dataset for Machine Learning-Based Image Classification",
    authors: ["Shakib Howlader"],
    venue: "Data in Brief",
    type: "DATASET",
    doi: "10.0000/eggplant.dataset",
    url: null,
    abstract:
      "This dataset provides a curated collection of eggplant (Solanum melongena) leaf images spanning multiple disease categories and healthy specimens, captured under varied field conditions. Each image is labeled to support supervised machine-learning approaches for automated plant-disease classification. The dataset addresses the scarcity of high-quality, openly available agricultural imagery for eggplant and is intended to accelerate research in precision agriculture, computer vision and crop-health monitoring. Baseline classification results demonstrate its suitability for training convolutional neural networks and transfer-learning pipelines.",
    keywords: [
      "Plant Disease",
      "Computer Vision",
      "Image Classification",
      "Deep Learning",
      "Agriculture",
      "Dataset",
      "CNN",
    ],
    citationCount: null,
    bibtex: null,
    datasetUrl: null,
    impact:
      "Provides an openly available benchmark for eggplant leaf-disease classification, supporting reproducible research in agricultural AI and precision farming.",
    featured: true,
    publishedDate: new Date("2024-01-01"),
  },
];
