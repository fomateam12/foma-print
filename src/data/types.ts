/**
 * Shared catalog types. This module is intentionally free of any data import
 * so client components can import types/helpers without pulling the full
 * product dataset into the browser bundle.
 */

export type IconKey = "gift" | "cup-soda" | "coffee" | "frame" | "notebook";

export type PersonalizationType = "text" | "select";

export interface PersonalizationOption {
  id: string;
  label: string;
  type: PersonalizationType;
  required: boolean;
  placeholder?: string;
  helpText?: string;
  maxLength?: number;
  options?: string[];
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  size: string | null;
  basePrice: number;
  image: string;
  imageFull: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  subcategorySlug: string;
  subcategoryName: string;
  description: string;
  longDescription: string;
  badges: string[];
  rating: number;
  reviewCount: number;
  leadTimeDays: number;
  personalization: PersonalizationOption[];
}

export interface Subcategory {
  slug: string;
  name: string;
  blurb: string;
  productCount: number;
}

export interface Category {
  slug: string;
  name: string;
  blurb: string;
  icon: IconKey;
  subcategories: Subcategory[];
  productCount: number;
}

export interface SearchResult {
  id: string;
  name: string;
  categoryName: string;
  subcategoryName: string;
  categorySlug: string;
  subcategorySlug: string;
  basePrice: number;
  image: string;
}
