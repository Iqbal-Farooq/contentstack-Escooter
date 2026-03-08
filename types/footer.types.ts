/**
 * Footer content from Contentstack (image + link sections + social).
 * Copyright is static in the app and not from Contentstack.
 */

export interface FooterLink {
  link_text: string;
  link_url: string;
}

export interface FooterSection {
  section_heading: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  /** Icon image URL from CMS (optional) */
  icon_url?: string | null;
}

/** Decorative image (e.g. scooter) from Contentstack */
export interface FooterImage {
  url: string;
  alt_text?: string;
  title?: string;
}

export interface FooterData {

  decorative_image?: FooterImage | null;

  footer_sections: FooterSection[];

  social_links: SocialLink[];
}

export interface FooterProps {
  data: FooterData | null;
}
