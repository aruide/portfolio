import type { LucideIcon } from 'lucide-react';

// ─── Strapi v5 ────────────────────────────────────────────────────────────────

/** Réponse Strapi pour une collection (tableau) */
export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number } };
}

/** Réponse Strapi pour un Single Type (objet unique) */
export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

/** Média Strapi (image, fichier…) */
export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText: string | null;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

/** Entrée Aboutpage dans Strapi */
export interface AboutpageEntry {
  id: number;
  documentId: string;
  image: StrapiMedia | null;
  first_description: string;
  second_description: string;
  values_description: string;
  first_title_values: string;
  first_library_logo_values: string | null;
  first_logo_values: string | null;
  first_description_values: string;
  second_title_values: string;
  second_library_logo_values: string | null;
  second_logo_values: string | null;
  second_description_values: string;
  third_title_values: string;
  third_library_logo_values: string | null;
  third_logo_values: string | null;
  third_description_values: string;
}

/** Entrée Homepage dans Strapi */
export interface HomepageEntry {
  id: number;
  documentId: string;
  first_title: string;
  second_title: string;
  work_title: string;
  description: string;
}

export interface NavLink {
  name: string;
  path: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
}

export interface Skill {
  name: string;
  icon: LucideIcon;
  level: number;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** Entrée Competence dans Strapi */
export interface CompetenceEntry {
  id: number;
  documentId: string;
  title: string;
  note: number; // 0–3
  type_competence: string;
  library_icon: string | null;
  icon: string | null;
}

/** Entrée Experience dans Strapi */
export interface ExperienceEntry {
  id: number;
  documentId: string;
  intitule: string;
  nom_etablissement: string;
  date_debut: string;
  date_fin: string | null;
  description: string;
  type: 'entreprise' | 'diplome';
  image: StrapiMedia | null;
}

/** Entrée Project dans Strapi (sync GitHub) */
export interface ProjectEntry {
  id: number;
  documentId: string;
  github_id: number;
  name: string;
  description: string | null;
  github_url: string;
  topics: string[] | null;
  image_url: string | null;
  creation_date: string;
}

/** Entrée Contact dans Strapi */
export interface ContactEntry {
  id: number;
  documentId: string;
  title: string;
  library_icon: string | null;
  icon: string | null;
  url: string;
}

/** Entrée CVpage dans Strapi */
export interface CVpageEntry {
  id: number;
  documentId: string;
  title: string;
  subtitle: string | null;
  cv_file: StrapiMedia | null;
  cv_button_label: string | null;
}
