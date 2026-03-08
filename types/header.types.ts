/**
 * Header content type and UI props.
 * Aligns with Contentstack Header (Global), Site Logo, Primary CTA, Secondary Links.
 */

import type { NavItem, SecondaryLink } from './navigation.types';

export interface Logo {
  image_url: string;
  link_url?: string;
  alt_text?: string;
}

export interface PrimaryCTA {
  button_text: string;
  button_url: string;
  open_in_new_tab?: boolean;
  style?: 'primary' | 'secondary';
}

export interface HeaderData {
  title?: string;
  logo: Logo;
  navigation: NavItem[];
  primary_cta?: PrimaryCTA;
  secondary_links?: SecondaryLink[];
  sticky?: boolean;
  show_search?: boolean;
}

export interface HeaderProps {
  data: HeaderData;
}
