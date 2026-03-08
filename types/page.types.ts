export interface HeroBannerData {
  headline: string;
  headline_bold: string;
  description: string;
  primary_cta: {
    label: string;
    url: string;
    open_in_new_tab?: boolean;
  };
  video_cta?: {
    label: string;
    video_url: string;
  };
  product_image: {
    url: string;
    alt_text?: string;
  };
}

export interface SpecItem {
  value: string;
  unit: string;
  label: string;
}

export interface ProductInformationData {
  product_name: string;
  short_description: string;
  featured_image: {
    url: string;
    alt?: string;
  };
  features: string[];
}

export interface HighEfficiencyMotorData {
  product_name: string;
  short_description: string;
  image: {
    url: string;
    alt?: string;
  };
}

export interface AccessoriesImageItem {
  url: string;
  alt?: string;
}

/** First block: title + features on left, images on right (e.g. Golf Bag Rock) */
export interface AccessoriesFirstSection {
  type: 'first_section';
  list_title: string;
  features: string[];
  images: AccessoriesImageItem[];
}

/** Second block: images on left, title + features on right, plus CTA (e.g. Shopping Rack) */
export interface AccessoriesSecondSection {
  type: 'second_section';
  title: string;
  features: string[];
  images: AccessoriesImageItem[];
  cta?: { label: string; url: string };
}

export type AccessoriesBlock = AccessoriesFirstSection | AccessoriesSecondSection;

export interface AccessoriesData {
  title: string;
  description: string;
  blocks: AccessoriesBlock[];
}

export interface GalleryData {
  heading: string;
  short_description: string;
  images: Array<{ url: string; alt?: string; overlay_text?: string }>;
  buttons: Array<{ label: string; url: string }>;
}

export interface ColorsData {
  title: string;
  short_description: string;
  banner_image?: { url: string; alt?: string };
  color_options: Array<{ url: string; alt?: string; index: number }>;
}

export interface TestimonialItem {
  image: { url: string; alt?: string };
  quote: string;
  name: string;
  designation: string;
  rating: number;
}

export interface TestimonialsData {
  heading: string;
  testimonials: TestimonialItem[];
}

export interface PageSeo {
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  no_index?: boolean;
  open_graph_image?: string | null;
}

/** Page slug from Contentstack (e.g. title: "Home", href: "/home") */
export interface PageSlug {
  title: string;
  href: string;
}

/** One page section — type discriminator + payload. Order matches API page_sections[]. */
export type LandingPageSection =
  | { type: 'hero'; data: { hero_banner: HeroBannerData; specs: SpecItem[] } }
  | { type: 'product_information'; data: ProductInformationData }
  | { type: 'high_efficiency_motor'; data: HighEfficiencyMotorData }
  | { type: 'accessories'; data: AccessoriesData }
  | { type: 'gallery'; data: GalleryData }
  | { type: 'colors'; data: ColorsData }
  | { type: 'testimonials'; data: TestimonialsData };

export interface LandingPageData {
  title: string;
  /** Slug from API (slug.title, slug.href) */
  slug?: PageSlug;
  /** SEO from API global_field (meta_title, meta_descriptions, canonical_url, no_index) */
  seo?: PageSeo;
  /** Sections in the order they appear in Contentstack page_sections — use this for rendering. */
  sections: LandingPageSection[];
}
