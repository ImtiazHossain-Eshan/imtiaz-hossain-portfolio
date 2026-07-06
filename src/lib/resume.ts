/**
 * Single source of truth for the resume, rendered on /resume and mirrored by
 * the downloadable formats in public/resume. Every line is evidence-based:
 * no invented employers, publications, or numbers.
 */
import { site } from "./site";

export const resume = {
  name: site.name,
  title: "AI Engineer · Machine Learning · Computer Vision · NLP · Research",
  location: site.location,
  email: site.email,
  links: {
    portfolio: site.url,
    github: site.links.github,
    linkedin: site.links.linkedin,
    scholar: site.links.scholar,
    leetcode: site.links.leetcode,
  },

  summary:
    "AI Engineer and researcher specializing in computer vision, NLP, and deep learning, with a track record of production-grade full-stack systems and rigorous, reproducible ML studies. I train and evaluate models end to end (88.22% test Dice for brain-tumor segmentation, 97.40% accuracy for AI-text detection, 0.9376 macro-F1 across a 27-run NLP benchmark) and ship systems that run on zero-cost cloud infrastructure. My research advances biometric privacy under generative editing. I optimize for evidence over polish, reporting honest ceilings and failure modes alongside headline metrics.",

  education: {
    school: site.university,
    degree: "B.Sc. in Computer Science and Engineering",
    location: "Dhaka, Bangladesh",
    detail: "CGPA 3.7+",
    coursework: [
      "Machine Learning",
      "Artificial Intelligence",
      "Computer Graphics",
      "Operating Systems",
      "Database Systems",
      "Data Structures & Algorithms",
    ],
  },

  skills: {
    Languages: ["Python", "TypeScript", "C", "JavaScript", "SQL", "PHP"],
    "AI / ML": ["PyTorch", "scikit-learn", "HuggingFace Transformers", "OpenCV", "gensim", "NumPy", "pandas"],
    "Models & methods": [
      "U-Net / Attention U-Net",
      "DenseNet / EfficientNet / MobileNet",
      "BERT / RNN / GRU / LSTM",
      "Random Forest / SVM / k-means",
      "Diffusion & adversarial ML",
      "RAG / LLM structured output",
    ],
    "Web & backend": ["Next.js", "React", "Node.js", "Express", "Hono", "MongoDB", "MySQL", "Drizzle"],
    "Cloud & tooling": ["Cloudflare Workers / D1 / R2", "Vercel", "Docker", "Git", "Linux", "PWA"],
    Research: ["Experimental design", "Feature engineering", "Model evaluation", "LaTeX", "Technical writing"],
  },

  experience: [
    {
      role: "AI Researcher (Biometric Privacy)",
      org: "Independent Research · BRAC University",
      period: "2026",
      bullets: [
        "Designed a privacy framework for multi-portrait biometric unlinkability under generative editing, protecting every detected face in a group image with a single imperceptible, mask-guided perturbation.",
        "Engineered a teacher-student-refinement pipeline: a diffusion-guided teacher, a lightweight student generator for efficient deployment, and an inference-time refinement stage within a bounded perceptual budget.",
        "Reduced face-recognition similarity from 0.957 to 0.138 after generative edits while keeping the protected image visually faithful, training against a face-recognition ensemble and differentiable editing attacks.",
      ],
    },
    {
      role: "Machine Learning Engineer (Medical Imaging)",
      org: "Brain Tumor Segmentation & Classification",
      period: "2026",
      bullets: [
        "Implemented and compared U-Net, Attention U-Net, and three CNN classifiers (DenseNet-121, EfficientNet-B0, MobileNetV2) on the BRISC 2025 MRI dataset in PyTorch.",
        "Achieved 88.22% test Dice, 79.74% mIoU, and 99.61% pixel accuracy for segmentation, and 97.50% four-class classification accuracy on 860 unseen samples.",
        "Ran a 20-configuration hyperparameter study and demonstrated that separate task-specific training outperforms joint multi-task learning by ~5 points, informing the deployment recommendation.",
      ],
    },
    {
      role: "NLP Engineer",
      org: "News Classification & AI-Text Detection",
      period: "2025 – 2026",
      bullets: [
        "Built a reproducible benchmark of 27 experiments (9 architectures x 3 preprocessing pipelines) on 102k news headlines, reaching 0.9376 macro-F1 with BERT-Base and 0.9214 with a Bi-GRU trained in 19 seconds.",
        "Engineered 28 stylometric features with mRMR and RFE selection for AI-generated text detection, reaching 97.40% accuracy on HC3 with Random Forest and quantifying a severe cross-generator generalization gap.",
        "Identified that BERT's WordPiece tokenizer inverts the preprocessing rules that hold for classical models, a model-specific insight for practitioners.",
      ],
    },
    {
      role: "Full-Stack Engineer",
      org: "BRACU Vault · Polaris · E-GamerHub",
      period: "2025 – 2026",
      bullets: [
        "Built BRACU Vault, a verified study-archive platform, on Cloudflare's free tier (Workers + Hono, D1, R2, Clerk) with a data-driven six-role RBAC model and university-email-gated uploads.",
        "Engineered Polaris, an AI academic strategist using Gemini structured-JSON output, RAG over a curated knowledge base, and a transparent logistic-regression probability model, with graceful no-API-key fallback.",
        "Developed E-GamerHub, a MERN social platform with Socket.IO real-time messaging, RBAC moderation, and Groq Llama 3 natural-language player search.",
      ],
    },
  ],

  projectsHighlight: [
    "Custom UNIX shell in C (pipes, redirection, chaining, signal handling)",
    "VSFSck file-system consistency checker (superblock, bitmaps, inode cross-checks)",
    "OpenGL games from primitives (midpoint line algorithm, AABB collision)",
    "Software quality prediction ML study (honest 0.4418 F1 ceiling reported)",
  ],

  research: [
    {
      title: "Multi-Portrait Biometric Unlinkability under Generative Editing",
      venue: "Working paper",
      year: "2026",
      note: "Joint multi-face privacy protection via a teacher-student-refinement pipeline.",
    },
  ],

  certifications: [
    { title: "Understanding Machine Learning", issuer: "DataCamp" },
    { title: "Data Manipulation in Python", issuer: "DataCamp" },
    { title: "Cleaning Data in Python", issuer: "DataCamp" },
  ],
} as const;

/** Honest self-assessment scorecard shown at the foot of /resume. */
export const resumeScorecard = {
  scores: [
    { label: "ATS compatibility", score: 92 },
    { label: "Readability", score: 90 },
    { label: "Technical depth", score: 93 },
    { label: "Research strength", score: 82 },
    { label: "AI/ML positioning", score: 91 },
    { label: "Software engineering positioning", score: 88 },
    { label: "Overall hiring competitiveness", score: 88 },
  ],
  recommendations: [
    "Convert the working paper into a public preprint (arXiv) and add a DOI, the single highest-leverage gap for research roles.",
    "Open-source the trained model weights or a hosted inference Space for the AI projects to make the metrics independently reproducible.",
    "Add a formal internship or research-assistant role when available; the project evidence is strong, but named affiliations strengthen recruiter signal.",
    "Publish a subset of the seeded blog posts to demonstrate written communication depth.",
  ],
} as const;
