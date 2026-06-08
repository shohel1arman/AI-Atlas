import type { ModuleDef, ModuleGroup } from "./types";

/**
 * ── THE REGISTRY ──
 * Single source of truth for the whole platform. The sidebar, the home grid,
 * and the router are all generated from this array. It mirrors the lab
 * structure of the AI Atlas master spec.
 *
 * To add a real, working playground:
 *   1. Create src/playgrounds/<Name>/<Name>Playground.tsx (default export)
 *   2. Flip `status` to "live" and point `load` at it.
 * That's the entire integration cost — nothing else changes.
 */
export const MODULES: ModuleDef[] = [
  // ───────────────────────── Math Lab ─────────────────────────
  {
    id: "vectors",
    slug: "vectors",
    title: "Vectors & Dot Product",
    blurb: "Drag two vectors; see the dot product, angle, and projection update live.",
    icon: "➤",
    group: "Math Lab",
    status: "live",
    load: () => import("@/playgrounds/Vectors/VectorsPlayground"),
  },
  {
    id: "linalg",
    slug: "linear-algebra",
    title: "Linear Algebra",
    blurb: "Watch a 2×2 matrix bend all of space. Basis vectors, determinant, orientation.",
    icon: "▦",
    group: "Math Lab",
    status: "live",
    load: () => import("@/playgrounds/LinearAlgebra/LinearAlgebraPlayground"),
  },
  {
    id: "gaussian",
    slug: "gaussian",
    title: "Gaussian Distribution",
    blurb: "The bell curve, plus live random sampling so you can see sampling error.",
    icon: "🔔",
    group: "Math Lab",
    status: "live",
    load: () => import("@/playgrounds/Gaussian/GaussianPlayground"),
  },
  {
    id: "optimization",
    slug: "optimization",
    title: "Optimization Landscape",
    blurb: "A contour map with gradient descent rolling downhill. See why learning rate matters.",
    icon: "⛰",
    group: "Math Lab",
    status: "live",
    load: () => import("@/playgrounds/Optimization/OptimizationPlayground"),
  },
  {
    id: "gradient-descent",
    slug: "gradient-descent",
    title: "Gradient Descent (1-D fit)",
    blurb: "Watch a line fit itself to your data, one gradient step at a time.",
    icon: "📉",
    group: "Math Lab",
    status: "live",
    load: () => import("@/playgrounds/GradientDescent/GradientDescentPlayground"),
  },
  {
    id: "eigen",
    slug: "eigenvectors",
    title: "Eigenvectors",
    blurb: "The directions a transform only stretches, never rotates.",
    icon: "↗",
    group: "Math Lab",
    status: "soon",
  },

  // ─────────────────────── Data Analysis ───────────────────────
  {
    id: "sql",
    slug: "sql-playground",
    title: "SQL Playground",
    blurb: "Write queries against a sample dataset and see results + charts live.",
    icon: "🗄",
    group: "Data Analysis",
    status: "soon",
  },

  // ───────────────────── Machine Learning ─────────────────────
  {
    id: "kmeans",
    slug: "machine-learning",
    title: "K-Means Clustering",
    blurb: "Step through Lloyd's algorithm — assign, recenter, repeat — and watch clusters lock in.",
    icon: "🔮",
    group: "Machine Learning",
    status: "live",
    load: () => import("@/playgrounds/KMeans/KMeansPlayground"),
  },
  {
    id: "logreg",
    slug: "logistic-regression",
    title: "Logistic Regression",
    blurb: "A linear decision boundary with a sigmoid — the simplest classifier.",
    icon: "∿",
    group: "Machine Learning",
    status: "soon",
  },
  {
    id: "trees",
    slug: "decision-trees",
    title: "Decision Trees",
    blurb: "Recursive splits carving up feature space, built live.",
    icon: "🌳",
    group: "Machine Learning",
    status: "soon",
  },

  // ─────────────────────── Deep Learning ───────────────────────
  {
    id: "neuralnet",
    slug: "deep-learning",
    title: "Neural Net Trainer",
    blurb: "A real backprop network learning a decision boundary you can watch form.",
    icon: "🧠",
    group: "Deep Learning",
    status: "live",
    load: () => import("@/playgrounds/NeuralNet/NeuralNetPlayground"),
  },
  {
    id: "cnn",
    slug: "convolution",
    title: "Convolution & CNNs",
    blurb: "Slide a kernel over an image and watch feature maps appear.",
    icon: "▣",
    group: "Deep Learning",
    status: "soon",
  },

  // ──────────────────── Transformers & LLM ────────────────────
  {
    id: "attention",
    slug: "self-attention",
    title: "Self-Attention",
    blurb: "Tokens attending to tokens — the live attention heatmap.",
    icon: "🔤",
    group: "Transformers & LLM",
    status: "soon",
  },

  // ───────────────────────── Agents ─────────────────────────
  {
    id: "agents",
    slug: "agents",
    title: "Agent Builder",
    blurb: "Tool calls, planning, and memory in a drag-and-drop workflow.",
    icon: "🤖",
    group: "Agents",
    status: "soon",
  },

  // ─────────────────────── Generative AI ───────────────────────
  {
    id: "diffusion",
    slug: "diffusion",
    title: "Diffusion Models",
    blurb: "Noise into image — watch the denoising steps run.",
    icon: "✦",
    group: "Generative AI",
    status: "soon",
  },

  // ───────────────── Explainable AI & MLOps ─────────────────
  {
    id: "shap",
    slug: "explainable-ai",
    title: "SHAP & Attribution",
    blurb: "Which features moved the prediction, and by how much.",
    icon: "🔍",
    group: "Explainable AI & MLOps",
    status: "soon",
  },

  // ───────────────────────── Research ─────────────────────────
  {
    id: "biasvar",
    slug: "bias-variance",
    title: "Bias–Variance",
    blurb: "Underfit vs overfit, made tactile with a polynomial degree slider.",
    icon: "🧪",
    group: "Research",
    status: "soon",
  },
];

export const GROUP_ORDER: ModuleGroup[] = [
  "Math Lab",
  "Data Analysis",
  "Machine Learning",
  "Deep Learning",
  "Transformers & LLM",
  "Agents",
  "Generative AI",
  "Explainable AI & MLOps",
  "Research",
];

export const modulesByGroup = (g: ModuleGroup) => MODULES.filter((m) => m.group === g);
export const findModule = (slug: string) => MODULES.find((m) => m.slug === slug);
