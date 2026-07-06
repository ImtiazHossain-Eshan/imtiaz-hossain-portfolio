/** The eight domains for the About explorer, each with evidence links. */
export type Domain = {
  id: string;
  label: string;
  headline: string;
  body: string;
  evidence: Array<{ label: string; href: string }>;
  tools: string[];
};

export const domains: Domain[] = [
  {
    id: "research",
    label: "Research",
    headline: "Privacy under generative editing.",
    body: "My research centers on biometric privacy: keeping people un-relinkable to face-recognition systems after their photos are edited by generative models. My working paper protects every face in a group image jointly, through a teacher-student-refinement pipeline, and reports its own limits honestly.",
    evidence: [
      { label: "Working paper", href: "/research" },
      { label: "Google Scholar", href: "https://scholar.google.com/citations?user=CIjeZSsAAAAJ&hl=en" },
    ],
    tools: ["Diffusion models", "Adversarial ML", "Face recognition", "PyTorch"],
  },
  {
    id: "computer-vision",
    label: "Computer Vision",
    headline: "Segmentation and classification that generalize.",
    body: "Medical imaging is where I push computer vision hardest. My brain-tumor pipeline hit 88.22% test Dice with U-Net and 97.50% classification with DenseNet-121 on BRISC 2025, and I proved separate task-specific training beats a shared multi-task encoder on that data.",
    evidence: [
      { label: "Brain tumor case study", href: "/projects/brain-tumor-segmentation" },
      { label: "Try the segmentation demo", href: "/playground/brain-tumor" },
    ],
    tools: ["U-Net", "DenseNet", "OpenCV", "Albumentations", "OpenGL"],
  },
  {
    id: "ai",
    label: "Artificial Intelligence",
    headline: "Structured, transparent AI systems.",
    body: "I build AI systems that are legible, not just accurate. Polaris uses structured-JSON LLM output and a transparent logistic-regression probability model with visible factor weights, and degrades gracefully to a heuristic engine with no API key.",
    evidence: [
      { label: "Polaris case study", href: "/projects/polaris" },
      { label: "Live demo", href: "https://polaris-zcq9.vercel.app/" },
    ],
    tools: ["Gemini", "RAG", "Structured output", "Groq Llama 3"],
  },
  {
    id: "image-processing",
    label: "Image Processing",
    headline: "Pixels as first-class data.",
    body: "From soft-mask-guided perturbations to segmentation-overlay pipelines and hand-rolled OpenGL rasterization, I work close to the pixel. I care about the boundary between what a model sees and what a human sees.",
    evidence: [
      { label: "Research figures", href: "/research" },
      { label: "OpenGL games", href: "/projects/opengl-games" },
    ],
    tools: ["Soft masks", "Grad-CAM", "Midpoint algorithm", "PIL"],
  },
  {
    id: "nlp",
    label: "Natural Language Processing",
    headline: "From TF-IDF to transformers, measured.",
    body: "I benchmark NLP rigorously. Twenty-seven controlled experiments on news classification showed BERT tops out at 0.9376 macro-F1 while a 19-second Bi-GRU reaches 0.9214, and that BERT inverts the preprocessing rules every other model follows. My AI-text detector reaches 97.40% in-domain and I report exactly where it fails to generalize.",
    evidence: [
      { label: "News classification demo", href: "/playground/news-classification" },
      { label: "AI-text detection demo", href: "/playground/text-detection" },
    ],
    tools: ["BERT", "Skip-gram", "TF-IDF", "HuggingFace", "scikit-learn"],
  },
  {
    id: "cloud",
    label: "Cloud & Systems",
    headline: "Production systems on a $0 budget.",
    body: "BRACU Vault runs an entire verified-upload platform, a Hono Worker, D1, R2, and Clerk-gated auth, on Cloudflare's free tier with a data-driven six-role RBAC model. Constraint-driven architecture is a feature, not a limitation.",
    evidence: [
      { label: "BRACU Vault case study", href: "/projects/bracu-vault" },
      { label: "Live site", href: "https://www.bracuvault.me/" },
    ],
    tools: ["Cloudflare Workers", "D1", "R2", "Drizzle", "Vercel"],
  },
  {
    id: "systems",
    label: "Systems Programming",
    headline: "Down to fork, exec, and raw bytes.",
    body: "I implemented a UNIX shell in C, with pipes, redirection, chaining, and signal handling from scratch, and a file-system consistency checker that reconciles bitmaps against inodes in a raw 64-block image. This is where abstraction stops being magic.",
    evidence: [
      { label: "Custom shell", href: "/projects/custom-shell" },
      { label: "VSFSck", href: "/projects/vsfsck" },
    ],
    tools: ["C", "POSIX", "File systems", "Binary I/O"],
  },
  {
    id: "game-dev",
    label: "Game Development",
    headline: "Games from primitives up.",
    body: "Under a strict no-engine, no-sprite constraint, I built three OpenGL games where every raindrop and laser is drawn from points and lines, plus a game-theory simulation of sequential bargaining. Writing the render loop by hand is the fastest way to understand graphics.",
    evidence: [
      { label: "OpenGL trilogy", href: "/projects/opengl-games" },
      { label: "The Proposer's Dilemma", href: "/projects/proposers-dilemma" },
    ],
    tools: ["PyOpenGL", "GLUT", "Game theory", "AABB collision"],
  },
];
