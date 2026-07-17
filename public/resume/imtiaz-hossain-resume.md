# Imtiaz Hossain

**AI/ML Research | Computer Vision & NLP | Full-Stack, Mobile & Systems Engineering**

Dhaka, Bangladesh | +880 1401-692968 | imtiaz.hossain.eshan@gmail.com | imtiazhossain.dev
GitHub: github.com/ImtiazHossain-Eshan | LinkedIn: linkedin.com/in/imtiazhossaineshan | Google Scholar: scholar.google.com/citations?user=CIjeZSsAAAAJ

## Summary

Computer Science and Engineering student at BRAC University working across machine learning, computer vision, natural language processing, mobile development, and full-stack systems. Builds projects from experimental design and model evaluation through APIs, cloud deployment, and interactive interfaces. Research focuses on biometric privacy under generative image editing, with work in medical imaging and text analysis. Interested in research and engineering roles that value reproducible evidence, systems thinking, and dependable software.

## Technical Skills

**Programming Languages**

- Python, TypeScript, Kotlin, C, JavaScript, SQL, PHP
- Object-oriented programming, data structures, algorithms, and problem solving

**Machine Learning & Data Science**

- PyTorch, scikit-learn, Hugging Face Transformers, OpenCV, NumPy, pandas, gensim
- Regression, classification, hyperparameter search, cross-validation, and feature engineering
- Experimental design, class-imbalance handling, error analysis, evaluation, and reproducibility

**Computer Vision & NLP**

- U-Net, Attention U-Net, DenseNet, EfficientNet, MobileNet, and diffusion models
- BERT, RNN/GRU/LSTM, TF-IDF, embeddings, stylometry, mRMR, and RFE

**Web, Cloud & Data**

- Next.js, React, Node.js, Express, Hono, Socket.IO, REST APIs, and Zod
- Cloudflare Workers, D1, R2, Vercel, and Docker
- MongoDB, MySQL, Drizzle ORM, Clerk, JWT, and role-based access control

**Mobile, Systems & Tools**

- Android SDK, Jetpack Navigation, Activities, Fragments, ViewBinding, XML, and ConstraintLayout
- Intents, BroadcastReceiver, MediaPlayer, VideoView, Glide, and custom touch gestures
- POSIX, Linux, Git, Gradle, JUnit, Vitest, LaTeX, and technical writing

## Research Experience

### Independent Researcher - Biometric Privacy

**Obscrowd, BRAC University** | 2026 - Present

- Designed Obscrowd, a multi-portrait biometric privacy framework that protects every detected face with one soft-mask-guided perturbation while preserving the visual fidelity of the original image.
- Built a teacher-student-refinement pipeline combining a diffusion-guided teacher, lightweight student generator, face-recognition ensembles, and differentiable editing attacks for identity disruption.
- Evaluated protection per face across generative edits and processing conditions; a sample smile edit reduced recognition similarity from 0.957 to 0.138, while compression remains an open limitation.

### Machine Learning Engineer - Medical Imaging

**Brain Tumor Segmentation and Classification** | 2026

- Implemented U-Net and Attention U-Net segmentation plus DenseNet-121, EfficientNet-B0, and MobileNetV2 classification pipelines for four-class MRI analysis on the BRISC 2025 dataset in PyTorch.
- Achieved 88.22% test Dice, 79.74% mIoU, and 99.61% pixel accuracy with U-Net, while DenseNet-121 reached 97.50% classification accuracy on held-out BRISC MRI samples from the four-category test set.
- Ran 20 optimizer and learning-rate configurations and compared shared-encoder multi-task training with separate models, finding task-specific training improved both tasks and avoided task interference.

### NLP and Machine Learning Engineer

**News Classification and AI-Generated Text Detection** | 2025 - 2026

- Built a reproducible 27-run benchmark of nine architectures and three preprocessing pipelines across 102,002 training headlines, spanning TF-IDF, recurrent networks, and BERT-Base under matched controls.
- Reached 0.9376 macro-F1 with BERT-Base and 0.9214 with Bi-GRU trained in 18.7 seconds, showing that aggressive preprocessing helps shallow models but degrades pretrained transformers for this corpus.
- Engineered 28 lexical, syntactic, readability, and distributional features for AI-text detection; Random Forest reached 97.40% in-domain accuracy but exposed severe cross-generator failure.

## Selected Engineering Projects

### Full-Stack and AI Engineering

**BRACU Vault and Polaris** | 2026

- Built BRACU Vault, a verified academic resource platform on Next.js, Cloudflare Workers, Hono, D1, R2, Drizzle, and Clerk, with university-email-gated uploads, moderation, and audit trails.
- Designed a six-role, data-driven access model and controller-service-repository-policy API; atomic D1 activation and audit logging keep verification idempotent and traceable across privileged workflows.
- Built Polaris using Gemini structured JSON, retrieval over a 60-document knowledge base, and a transparent logistic-regression model for explainable academic planning and what-if simulation.
- Implemented offline heuristic fallbacks, Zod validation, subscription gating, MongoDB indexes, signed payment webhooks, and role-aware student, parent, partner, and admin views across paid tiers.

### Robotics and Real-Time Systems

**Vantage Arm Digital Twin and WattsUp Office Monitor** | 2026

- Engineered a Three.js robotic-arm digital twin with damped-least-squares inverse kinematics, forward-kinematics verification, collision checks, joint limits, motion replay, and autonomous PIN entry.
- Centralized manual, voice, Gemini-planned, replay, and PIN commands behind one deterministic safety gateway, with a Zustand state model and an ESP32 six-servo hardware concept for all control modes.
- Built WattsUp as a simulated IoT energy monitor whose Express backend owns 15-device state, virtual time, usage, and alert rules shared by a live Three.js dashboard and Discord bot without client drift.
- Synchronized controls over Socket.IO and exposed status, usage, simulation, turn-off, and alert commands through Discord.js, with stable IDs for deduplicated notifications across both interfaces.

### Android Application Development

**CSE489 Mobile Application Development** | 2026

- Built two Kotlin Android applications covering Activities, Fragments, lifecycle state restoration, ViewBinding, Jetpack Navigation, responsive XML resources, and JUnit-tested business logic.
- Implemented custom broadcasts, battery status handling, Glide image loading, matrix-based pinch zoom and panning, plus audio and video playback with lifecycle-aware resource cleanup for lifecycle safety.

### Systems Programming

**Custom UNIX Shell and VSFSck** | 2025

- Built C systems tools: a POSIX shell with fork/exec, pipes, redirection, chaining, history, and scoped SIGINT handling, plus an fsck-style checker for superblocks, bitmaps, inodes, and block references.

## Additional Projects

- **E-GamerHub:** Co-developed a MERN social platform with Socket.IO messaging, RBAC moderation, per-game statistics, and Llama 3 intent extraction for natural-language player search.
- **CampusSync:** Built a PHP and MySQL PWA with automated course ingestion, routine-based free-time matching, read-state notifications, and offline fallback support.
- **UniBoard:** Built a PHP and MySQL campus noticeboard with verified club dashboards, event discovery filters, RSVP and calendar workflows, and engagement analytics.
- **Cholo:** Designed the normalized MySQL schema and PHP backend for a university ride-sharing system with verified accounts, recurring trips, ratings, and trip management.
- **OpenGL Games Trilogy:** Implemented three PyOpenGL and GLUT games using primitive rendering, midpoint line rasterization, AABB collision, and hand-written game loops.
- **Software Quality Prediction:** Compared four classifiers and k-means/PCA on 1,600 code-metric samples, reporting the weak 0.4418 best weighted-F1 signal as the study's central finding.
- **The Proposer's Dilemma:** Built a multi-round Python bargaining simulation that makes Nash equilibrium, backward induction, acceptance behavior, and changing incentives visible through score trajectories.

## Research Output

**Multi-Portrait Biometric Unlinkability under Generative Editing.** Working paper, 2026. Single-author manuscript in preparation; full methods and quantitative results remain restricted.

## Education

**B.Sc. in Computer Science and Engineering**, BRAC University | 2023 - Present
Dhaka, Bangladesh | CGPA 3.7+

Relevant coursework: Machine Learning, Artificial Intelligence, Mobile Application Development, Computer Graphics, Operating Systems, Database Systems, Data Structures and Algorithms.

## Teaching & Leadership

**Private Tutor**, Dhaka, Bangladesh | 2024 - Present
Tutors programming in C, Java, and Python alongside data structures, algorithms, and mathematics; supports students with problem solving and university coursework.

**Assistant Director**, BRACU E-Sports Club | Leadership experience
Supported club operations and esports event management at BRAC University.

## Honors & Certifications

- Four-time scholarship recipient based on merit and prior academic results
- Final-round participant, Bit Battles Programming Contest
- Solved 233+ algorithmic problems on LeetCode
- IELTS overall band 7
- Understanding Machine Learning - DataCamp
- Data Manipulation in Python - DataCamp
- Cleaning Data in Python - DataCamp

## Provenance Notes

- Obscrowd is a working paper in preparation and is not presented as published or peer reviewed.
- Research metrics are project evaluation results, not employer or production claims.
- Android skills are supported by the two inspected CSE489 assignment codebases.
- Leadership is listed without an invented date because the available source does not provide one.
