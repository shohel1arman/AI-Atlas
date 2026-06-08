import type { ComponentType, LazyExoticComponent } from "react";

/** Lifecycle status of a module — surfaced as a badge in the UI. */
export type ModuleStatus = "live" | "soon";

/** Lab groupings — mirror the FINAL MASTER PROMPT platform structure. */
export type ModuleGroup =
  | "Math Lab"
  | "Data Analysis"
  | "Machine Learning"
  | "Deep Learning"
  | "Transformers & LLM"
  | "Agents"
  | "Generative AI"
  | "Explainable AI & MLOps"
  | "Research";

/**
 * A learning module. Adding a new playground = adding one ModuleDef to the
 * registry. The `load` function is dynamically imported so each module is
 * code-split and only fetched when the user navigates to it.
 */
export interface ModuleDef {
  id: string;
  /** URL path segment, e.g. "vectors" -> /m/vectors */
  slug: string;
  title: string;
  /** Short tagline shown on the home grid. */
  blurb: string;
  icon: string;
  group: ModuleGroup;
  status: ModuleStatus;
  /** Lazy component. Undefined for "soon" modules (a stub is shown instead). */
  load?: () => Promise<{ default: ComponentType }>;
}

export type LazyModule = LazyExoticComponent<ComponentType>;
