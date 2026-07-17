import { site } from "@/lib/site";

export const resume = {
  name: site.name,
  title: "AI/ML Research | Computer Vision & NLP | Full-Stack, Mobile & Systems Engineering",
  location: site.location,
  phone: "+880 1401-692968",
  email: site.email,
  links: {
    portfolio: site.url,
    github: site.links.github,
    linkedin: site.links.linkedin,
    scholar: site.links.scholar,
    leetcode: site.links.leetcode,
  },

  summary:
    "Computer Science and Engineering student at BRAC University working across machine learning, computer vision, natural language processing, mobile development, and full-stack systems. Builds projects from experimental design and model evaluation through APIs, cloud deployment, and interactive interfaces. Research focuses on biometric privacy under generative image editing, with work in medical imaging and text analysis. Interested in research and engineering roles that value reproducible evidence, systems thinking, and dependable software.",

  skills: [
    {
      group: "Programming Languages",
      lines: [
        "Python, TypeScript, Kotlin, C, JavaScript, SQL, PHP",
        "Object-oriented programming, data structures, algorithms, and problem solving",
      ],
    },
    {
      group: "Machine Learning & Data Science",
      lines: [
        "PyTorch, scikit-learn, Hugging Face Transformers, OpenCV, NumPy, pandas, gensim",
        "Regression, classification, hyperparameter search, cross-validation, and feature engineering",
        "Experimental design, class-imbalance handling, error analysis, evaluation, and reproducibility",
      ],
    },
    {
      group: "Computer Vision & NLP",
      lines: [
        "U-Net, Attention U-Net, DenseNet, EfficientNet, MobileNet, and diffusion models",
        "BERT, RNN/GRU/LSTM, TF-IDF, embeddings, stylometry, mRMR, and RFE",
      ],
    },
    {
      group: "Web, Cloud & Data",
      lines: [
        "Next.js, React, Node.js, Express, Hono, Socket.IO, REST APIs, and Zod",
        "Cloudflare Workers, D1, R2, Vercel, and Docker",
        "MongoDB, MySQL, Drizzle ORM, Clerk, JWT, and role-based access control",
      ],
    },
    {
      group: "Mobile, Systems & Tools",
      lines: [
        "Android SDK, Jetpack Navigation, Activities, Fragments, ViewBinding, XML, and ConstraintLayout",
        "Intents, BroadcastReceiver, MediaPlayer, VideoView, Glide, and custom touch gestures",
        "POSIX, Linux, Git, Gradle, JUnit, Vitest, LaTeX, and technical writing",
      ],
    },
  ],

  researchExperience: [
    {
      role: "Independent Researcher - Biometric Privacy",
      org: "Obscrowd, BRAC University",
      period: "2026 - Present",
      bullets: [
        "Designed Obscrowd, a multi-portrait biometric privacy framework that protects every detected face with one soft-mask-guided perturbation while preserving the visual fidelity of the original image.",
        "Built a teacher-student-refinement pipeline combining a diffusion-guided teacher, lightweight student generator, face-recognition ensembles, and differentiable editing attacks for identity disruption.",
        "Evaluated protection per face across generative edits and processing conditions; a sample smile edit reduced recognition similarity from 0.957 to 0.138, while compression remains an open limitation.",
      ],
    },
    {
      role: "Machine Learning Engineer - Medical Imaging",
      org: "Brain Tumor Segmentation and Classification",
      period: "2026",
      bullets: [
        "Implemented U-Net and Attention U-Net segmentation plus DenseNet-121, EfficientNet-B0, and MobileNetV2 classification pipelines for four-class MRI analysis on the BRISC 2025 dataset in PyTorch.",
        "Achieved 88.22% test Dice, 79.74% mIoU, and 99.61% pixel accuracy with U-Net, while DenseNet-121 reached 97.50% classification accuracy on held-out BRISC MRI samples from the four-category test set.",
        "Ran 20 optimizer and learning-rate configurations and compared shared-encoder multi-task training with separate models, finding task-specific training improved both tasks and avoided task interference.",
      ],
    },
    {
      role: "NLP and Machine Learning Engineer",
      org: "News Classification and AI-Generated Text Detection",
      period: "2025 - 2026",
      bullets: [
        "Built a reproducible 27-run benchmark of nine architectures and three preprocessing pipelines across 102,002 training headlines, spanning TF-IDF, recurrent networks, and BERT-Base under matched controls.",
        "Reached 0.9376 macro-F1 with BERT-Base and 0.9214 with Bi-GRU trained in 18.7 seconds, showing that aggressive preprocessing helps shallow models but degrades pretrained transformers for this corpus.",
        "Engineered 28 lexical, syntactic, readability, and distributional features for AI-text detection; Random Forest reached 97.40% in-domain accuracy but exposed severe cross-generator failure.",
      ],
    },
  ],

  engineeringProjects: [
    {
      role: "Full-Stack and AI Engineering",
      org: "BRACU Vault and Polaris",
      period: "2026",
      bullets: [
        "Built BRACU Vault, a verified academic resource platform on Next.js, Cloudflare Workers, Hono, D1, R2, Drizzle, and Clerk, with university-email-gated uploads, moderation, and audit trails.",
        "Designed a six-role, data-driven access model and controller-service-repository-policy API; atomic D1 activation and audit logging keep verification idempotent and traceable across privileged workflows.",
        "Built Polaris using Gemini structured JSON, retrieval over a 60-document knowledge base, and a transparent logistic-regression model for explainable academic planning and what-if simulation.",
        "Implemented offline heuristic fallbacks, Zod validation, subscription gating, MongoDB indexes, signed payment webhooks, and role-aware student, parent, partner, and admin views across paid tiers.",
      ],
    },
    {
      role: "Robotics and Real-Time Systems",
      org: "Vantage Arm Digital Twin and WattsUp Office Monitor",
      period: "2026",
      bullets: [
        "Engineered a Three.js robotic-arm digital twin with damped-least-squares inverse kinematics, forward-kinematics verification, collision checks, joint limits, motion replay, and autonomous PIN entry.",
        "Centralized manual, voice, Gemini-planned, replay, and PIN commands behind one deterministic safety gateway, with a Zustand state model and an ESP32 six-servo hardware concept for all control modes.",
        "Built WattsUp as a simulated IoT energy monitor whose Express backend owns 15-device state, virtual time, usage, and alert rules shared by a live Three.js dashboard and Discord bot without client drift.",
        "Synchronized controls over Socket.IO and exposed status, usage, simulation, turn-off, and alert commands through Discord.js, with stable IDs for deduplicated notifications across both interfaces.",
      ],
    },
    {
      role: "Android Application Development",
      org: "CSE489 Mobile Application Development",
      period: "2026",
      bullets: [
        "Built two Kotlin Android applications covering Activities, Fragments, lifecycle state restoration, ViewBinding, Jetpack Navigation, responsive XML resources, and JUnit-tested business logic.",
        "Implemented custom broadcasts, battery status handling, Glide image loading, matrix-based pinch zoom and panning, plus audio and video playback with lifecycle-aware resource cleanup for lifecycle safety.",
      ],
    },
    {
      role: "Systems Programming",
      org: "Custom UNIX Shell and VSFSck",
      period: "2025",
      bullets: [
        "Built C systems tools: a POSIX shell with fork/exec, pipes, redirection, chaining, history, and scoped SIGINT handling, plus an fsck-style checker for superblocks, bitmaps, inodes, and block references.",
      ],
    },
  ],

  additionalProjects: [
    {
      name: "E-GamerHub",
      description:
        "Co-developed a MERN social platform with Socket.IO messaging, RBAC moderation, per-game statistics, and Llama 3 intent extraction for natural-language player search.",
    },
    {
      name: "CampusSync",
      description:
        "Built a PHP and MySQL PWA with automated course ingestion, routine-based free-time matching, read-state notifications, and offline fallback support.",
    },
    {
      name: "UniBoard",
      description:
        "Built a PHP and MySQL campus noticeboard with verified club dashboards, event discovery filters, RSVP and calendar workflows, and engagement analytics.",
    },
    {
      name: "Cholo",
      description:
        "Designed the normalized MySQL schema and PHP backend for a university ride-sharing system with verified accounts, recurring trips, ratings, and trip management.",
    },
    {
      name: "OpenGL Games Trilogy",
      description:
        "Implemented three PyOpenGL and GLUT games using primitive rendering, midpoint line rasterization, AABB collision, and hand-written game loops.",
    },
    {
      name: "Software Quality Prediction",
      description:
        "Compared four classifiers and k-means/PCA on 1,600 code-metric samples, reporting the weak 0.4418 best weighted-F1 signal as the study's central finding.",
    },
    {
      name: "The Proposer's Dilemma",
      description:
        "Built a multi-round Python bargaining simulation that makes Nash equilibrium, backward induction, acceptance behavior, and changing incentives visible through score trajectories.",
    },
  ],

  research: [
    {
      title: "Multi-Portrait Biometric Unlinkability under Generative Editing",
      venue: "Working paper",
      year: "2026",
      note: "Single-author manuscript in preparation; full methods and quantitative results remain restricted.",
    },
  ],

  education: {
    school: site.university,
    degree: "B.Sc. in Computer Science and Engineering",
    location: "Dhaka, Bangladesh",
    period: "2023 - Present",
    detail: `CGPA ${site.cgpa}`,
    coursework: [
      "Machine Learning",
      "Artificial Intelligence",
      "Mobile Application Development",
      "Computer Graphics",
      "Operating Systems",
      "Database Systems",
      "Data Structures and Algorithms",
    ],
  },

  teachingAndLeadership: [
    {
      role: "Private Tutor",
      org: "Dhaka, Bangladesh",
      period: "2024 - Present",
      description:
        "Tutors programming in C, Java, and Python alongside data structures, algorithms, and mathematics; supports students with problem solving and university coursework.",
    },
    {
      role: "Assistant Director",
      org: "BRACU E-Sports Club",
      period: "Leadership experience",
      description: "Supported club operations and esports event management at BRAC University.",
    },
  ],

  honors: [
    "Four-time scholarship recipient based on merit and prior academic results",
    "Final-round participant, Bit Battles Programming Contest",
    "Solved 233+ algorithmic problems on LeetCode",
    "IELTS overall band 7",
  ],

  certifications: [
    { title: "Understanding Machine Learning", issuer: "DataCamp" },
    { title: "Data Manipulation in Python", issuer: "DataCamp" },
    { title: "Cleaning Data in Python", issuer: "DataCamp" },
  ],

  provenance: [
    "Obscrowd is a working paper in preparation and is not presented as published or peer reviewed.",
    "Research metrics are project evaluation results, not employer or production claims.",
    "Android skills are supported by the two inspected CSE489 assignment codebases.",
    "Leadership is listed without an invented date because the available source does not provide one.",
  ],
} as const;
