/**
 * Navigation and link types for Header (and reusable across site).
 * Aligns with Contentstack: navigation_item, sub_navigation_items (dropdown).
 */

/** Single item in a nav dropdown (e.g. under Products). */
export interface SubNavigationItem {
  label: string;
  url: string;
  open_in_new_tab?: boolean;
}

export interface NavItem {
  label: string;
  url?: string;
  open_in_new_tab?: boolean;
  /** When true and sub_navigation_items has items, show as dropdown */
  has_dropdown?: boolean;
  /** Dropdown list (e.g. Products → Item 1, Item 2). Replaces legacy child_links. */
  sub_navigation_items?: SubNavigationItem[];
}

export interface SecondaryLink {
  label: string;
  url: string;
  open_in_new_tab?: boolean;
  style?: 'link' | 'button';
}

export interface NavigationData {
  title?: string;
  links: NavItem[];
}
