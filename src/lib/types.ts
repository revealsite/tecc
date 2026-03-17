export interface SectionLink {
  id: string;
  section_id: string;
  label: string;
  url: string;
  sort_order: number;
}

export interface NewsletterSection {
  id: string;
  newsletter_id: string;
  section_title: string;
  summary: string | null;
  sort_order: number;
  section_links: SectionLink[];
}

export interface Newsletter {
  id: string;
  year: number;
  month: number;
  title: string;
  source_type: "url" | "file";
  source_url: string | null;
  file_path: string | null;
  content_text: string | null;
  overall_summary: string | null;
  key_topics: string[] | null;
  ai_processed: boolean;
  created_at: string;
  updated_at: string;
  newsletter_sections: NewsletterSection[];
}

export interface NewsletterFormData {
  title: string;
  year: number;
  month: number;
  source_type: "url" | "file";
  source_url?: string;
}

export interface SectionFormData {
  newsletter_id: string;
  section_title: string;
  summary?: string;
  sort_order: number;
}

export interface LinkFormData {
  section_id: string;
  label: string;
  url: string;
  sort_order: number;
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
