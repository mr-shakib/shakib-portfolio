import type { PublicationDTO } from "@/lib/validations/content";

export const publicationsContent: PublicationDTO[] = [
  {
    id: "eggplant-leaf-disease-dataset",
    slug: "eggplant-leaf-disease-dataset",
    title:
      "A comprehensive image dataset for the identification of eggplant leaf diseases and computer vision applications",
    authors: [
      "Shakib Howlader",
      "Md. Sabbir Ahamed",
      "Mayen Uddin Mojumdar",
      "Sheak Rashed Haider Noori",
      "Shah Md Tanvir Siddiquee",
      "Narayan Ranjan Chakraborty",
    ],
    venue: "Data in Brief",
    type: "DATASET",
    doi: "10.1016/j.dib.2025.111353",
    url: "https://doi.org/10.1016/j.dib.2025.111353",
    abstract:
      "This dataset comprises 4,089 high-resolution images of eggplant (Solanum melongena) leaves, systematically categorized into six distinct classes: healthy leaves and five disease types — insect pest disease, leaf spot disease, mosaic virus disease, white mold disease, and wilt disease. The images were captured using smartphone cameras against consistent white backgrounds under varying lighting conditions across multiple geographic locations, then subjected to thorough manual labelling and preprocessing to ensure accuracy and consistency. The resource is particularly suitable for applications in plant pathology, precision agriculture, and disease forecasting, where timely and accurate diagnosis is crucial. Freely available for academic research, the dataset aims to advance automated disease-detection systems and sustainable farming practices.",
    keywords: [
      "Eggplant",
      "Leaf Disease",
      "Image Dataset",
      "Computer Vision",
      "Deep Learning",
      "Plant Pathology",
      "Precision Agriculture",
      "Image Classification",
    ],
    citationCount: null,
    bibtex: null,
    datasetUrl: null,
    impact:
      "An openly available, six-class benchmark of 4,089 labelled eggplant-leaf images — filling a gap in agricultural imagery and enabling reproducible research in automated plant-disease detection for precision farming.",
    featured: true,
    publishedDate: new Date("2025-04-01"),
  },
];
