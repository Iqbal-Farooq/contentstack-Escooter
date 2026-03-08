
import contentstack from '@contentstack/delivery-sdk';
import type { HeaderData } from '@/types/header.types';
import type { FooterData } from '@/types/footer.types';
import type { NavItem, SubNavigationItem } from '@/types/navigation.types';
import type { LandingPageData, LandingPageSection, HeroBannerData, SpecItem, ProductInformationData, HighEfficiencyMotorData, AccessoriesData, AccessoriesBlock, GalleryData, ColorsData, TestimonialsData } from '@/types/page.types';

const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
const deliveryToken = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT;

function getStack() {
  if (!apiKey || !deliveryToken || !environment) {
    throw new Error(
      'Missing Contentstack env: NEXT_PUBLIC_CONTENTSTACK_API_KEY, DELIVERY_TOKEN, ENVIRONMENT'
    );
  }
  return contentstack.stack({
    apiKey,
    deliveryToken,
    environment,
  });
}

/** Raw Contentstack entry shapes (Delivery API response) */
interface CSFile {
  url?: string;
  filename?: string;
  title?: string;
  alt_text?: string;
}

interface CSLinkObj {
  href?: string;
  title?: string;
  url?: string;
}

/** Unresolved reference list from Contentstack (navigation_items when not included). */
interface CSReferenceList {
  reference?: Array<{ uid?: string; _content_type_uid?: string }>;
}

/** Resolved navigation_menu entry (primary_navigations reference). */
interface CSNavMenuEntry {
  title?: string;
  /** Can be resolved array or { reference: [{ uid, _content_type_uid }] } */
  navigation_items?: CSNavItem[] | CSReferenceList;
  menu_items?: CSNavItem[];
  items?: CSNavItem[];
  links?: CSNavItem[];
  nav_items?: CSNavItem[];
  menu_links?: CSNavItem[];
}

/** Single navigation_item entry from Contentstack (label + link, optional sub_navigation_items). */
interface CSNavigationItemEntry {
  uid?: string;
  title?: string;
  label?: string;
  link?: CSLinkObj;
  url?: CSLinkObj | string;
  /** Can be resolved array/object or { reference: [{ uid }] } */
  sub_navigation_items?: CSNavigationItemEntry[] | Record<string, CSNavigationItemEntry> | { reference?: Array<{ uid?: string }> };
}

interface CSNavItem {
  label?: string;
  title?: string;
  url?: CSLinkObj | string;
  link?: CSLinkObj;
  has_dropdown?: boolean;
  child_links?: Array<{ child_label?: string; link?: CSLinkObj; url?: CSLinkObj | string }>;
  children?: CSNavItem[];
}

/** Secondary link group from Header (Login: style, url, label) */
interface CSSecondaryLinkGroup {
  label?: string;
  url?: CSLinkObj | string;
  style?: string;
  open_in_new_tab?: boolean;
}

/** Global field used as CTA (e.g. Signup) */
interface CSGlobalField {
  label?: string;
  url?: CSLinkObj;
}

/** Footer column link item (Contentstack: title + link.href) */
interface CSFooterColumnLink {
  title?: string;
  link?: CSLinkObj;
}

/** Footer column section (Contentstack: footer_columns.links[] — heading + links) */
interface CSFooterColumnSection {
  heading?: string;
  links?: CSFooterColumnLink[];
}

/** Footer columns group (Contentstack: footer_columns.links) */
interface CSFooterColumns {
  links?: CSFooterColumnSection[];
}

/** Footer social item (Contentstack: footer_social_links.global_field[] — label, url, icon asset) */
interface CSFooterSocialItem {
  label?: string;
  url?: CSLinkObj;
  icon?: { url?: string; file?: { url?: string } };
}

/** Footer content type — actual API: footer_columns, footer_image (ref), footer_social_links.global_field */
interface CSFooterEntry {
  footer_columns?: CSFooterColumns;
  footer_image?: Array<{ uid?: string; _content_type_uid?: string; url?: string; title?: string; alt_text?: string; image_alternate_text?: string; image?: { url?: string; filename?: string } }>;
  footer_social_links?: { global_field?: CSFooterSocialItem[] };
}

/** Header content type — matches header.json schema: title, primary_navigations, global_field, secondary_links, logo */
interface CSHeaderEntry {
  title?: string;
  logo?: CSFile;
  /** Can be single entry, UID string, or array / array-like { "0": menuEntry } from API */
  primary_navigations?: CSNavMenuEntry | string | CSNavMenuEntry[] | Record<string, CSNavMenuEntry>;
  global_field?: CSGlobalField;
  secondary_links?: CSSecondaryLinkGroup;
  sticky?: boolean;
  show_search?: boolean;
}

function hrefFromUrl(url: CSLinkObj | string | undefined): string | undefined {
  if (!url) return undefined;
  if (typeof url === 'string') return url;
  return url.href ?? (url as CSLinkObj).url ?? url.title ?? undefined;
}

function navItemUrl(item: CSNavItem): string {
  const u = item.url ?? item.link;
  return hrefFromUrl(u) ?? '#';
}

interface CSChildLinkItem {
  child_label?: string;
  link?: CSLinkObj;
  url?: CSLinkObj | string;
}

function mapNavChildLinks(
  children: CSNavItem['child_links'] | CSNavItem['children']
): SubNavigationItem[] {
  const list = Array.isArray(children) ? children : [];
  return list
    .filter((c) => c && ('child_label' in c ? c.child_label : (c as CSNavItem).label))
    .map((c) => {
      const link = (c as CSChildLinkItem).link ?? (c as CSNavItem).url ?? (c as CSNavItem).link;
      const label = (c as CSChildLinkItem).child_label ?? (c as CSNavItem).label ?? (c as CSNavItem).title ?? '';
      return {
        label,
        url: hrefFromUrl(link) ?? '#',
        open_in_new_tab: false,
      };
    });
}

function mapCSNavItem(item: CSNavItem): NavItem {
  const childLinks = item.child_links ?? item.children;
  const sub = mapNavChildLinks(childLinks);
  return {
    label: item.label ?? item.title ?? '',
    url: navItemUrl(item),
    open_in_new_tab: false,
    has_dropdown: sub.length > 0,
    sub_navigation_items: sub.length > 0 ? sub : undefined,
  };
}

/** Normalize sub_navigation_items from resolved API shape (array or { "0": entry }) to SubNavigationItem[]. */
function mapSubNavigationItemsFromResolved(
  subField: CSNavigationItemEntry['sub_navigation_items']
): SubNavigationItem[] {
  if (!subField || typeof subField !== 'object') return [];
  if ('reference' in subField && Array.isArray(subField.reference)) return [];
  const list = Array.isArray(subField)
    ? subField
    : Object.keys(subField)
        .filter((k) => /^\d+$/.test(k))
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => (subField as Record<string, CSNavigationItemEntry>)[k]);
  return list
    .filter((e) => e && (e.label ?? e.title))
    .map((e) => ({
      label: e.label ?? e.title ?? '',
      url: hrefFromUrl(e.link ?? e.url) ?? '#',
      open_in_new_tab: false,
    }));
}

/** Map a resolved navigation_item entry to NavItem (sub_navigation_items from resolved data only; refs filled by caller). */
function mapNavigationItemEntry(
  entry: CSNavigationItemEntry,
  subItems?: SubNavigationItem[]
): NavItem {
  const url = hrefFromUrl(entry.link ?? entry.url) ?? '#';
  const sub = subItems ?? mapSubNavigationItemsFromResolved(entry.sub_navigation_items);
  return {
    label: entry.label ?? entry.title ?? '',
    url,
    open_in_new_tab: false,
    has_dropdown: sub.length > 0,
    sub_navigation_items: sub.length > 0 ? sub : undefined,
  };
}

/** Fetch navigation_item entries by UIDs (include sub_navigation_items); resolve reference when needed. */
async function fetchNavigationItemsByUids(
  stack: ReturnType<typeof contentstack.stack>,
  uids: string[]
): Promise<NavItem[]> {
  if (uids.length === 0) return [];
  try {
    const result = await stack
      .contentType('navigation_item')
      .entry()
      .includeReference('sub_navigation_items')
      .query()
      .containedIn('uid', uids)
      .find<CSNavigationItemEntry>();
    const entries = Array.isArray(result) ? result : (result as { entries?: CSNavigationItemEntry[] })?.entries ?? [];
    const byUid = new Map<string, CSNavigationItemEntry>();
    for (const e of entries) {
      const entry = e as unknown as CSNavigationItemEntry;
      if (entry?.uid) byUid.set(entry.uid, entry);
    }
    const subRefsByParentUid = new Map<string, string[]>();
    const allSubUids = new Set<string>();
    for (const entry of Array.from(byUid.values())) {
      const subRef = entry.sub_navigation_items;
      if (subRef && typeof subRef === 'object' && 'reference' in subRef && Array.isArray(subRef.reference)) {
        const refUids = (subRef.reference as Array<{ uid?: string }>).map((r) => r.uid).filter(Boolean) as string[];
        if (entry.uid) subRefsByParentUid.set(entry.uid, refUids);
        refUids.forEach((id) => allSubUids.add(id));
      }
    }
    let subByUid = new Map<string, CSNavigationItemEntry>();
    if (allSubUids.size > 0) {
      const subResult = await stack
        .contentType('navigation_item')
        .entry()
        .query()
        .containedIn('uid', Array.from(allSubUids))
        .find<CSNavigationItemEntry>();
      const subEntries = Array.isArray(subResult) ? subResult : (subResult as { entries?: CSNavigationItemEntry[] })?.entries ?? [];
      for (const e of subEntries) {
        const entry = e as unknown as CSNavigationItemEntry;
        if (entry?.uid) subByUid.set(entry.uid, entry);
      }
    }
    return uids.map((uid) => {
      const entry = byUid.get(uid);
      if (!entry) return { label: '', url: '#', open_in_new_tab: false, sub_navigation_items: undefined };
      const refUids = subRefsByParentUid.get(uid);
      const subItems: SubNavigationItem[] | undefined = refUids?.length
        ? refUids.map((id) => {
            const subEntry = subByUid.get(id);
            return subEntry
              ? { label: subEntry.label ?? subEntry.title ?? '', url: hrefFromUrl(subEntry.link ?? subEntry.url) ?? '#', open_in_new_tab: false }
              : { label: '', url: '#', open_in_new_tab: false };
          }).filter((s) => s.label)
        : undefined;
      return mapNavigationItemEntry(entry, subItems);
    });
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Contentstack] fetchNavigationItemsByUids failed:', e);
    }
    return [];
  }
}

/** Get the first menu entry when API returns primary_navigations as array or { "0": entry }. */
function getFirstMenuEntry(
  primaryNav: CSHeaderEntry['primary_navigations']
): CSNavMenuEntry | string | undefined {
  if (primaryNav == null) return undefined;
  if (typeof primaryNav === 'string') return primaryNav;
  if (Array.isArray(primaryNav)) return primaryNav[0];
  if (typeof primaryNav === 'object' && '0' in primaryNav) return (primaryNav as Record<string, CSNavMenuEntry>)['0'];
  return primaryNav as CSNavMenuEntry;
}

/** Resolve primary_navigations (menu entry) to NavItem[] — handles both resolved arrays and navigation_items.reference. */
async function resolveNavigationFromMenu(
  stack: ReturnType<typeof contentstack.stack>,
  primaryNav: CSHeaderEntry['primary_navigations']
): Promise<NavItem[]> {
  const menuEntry = getFirstMenuEntry(primaryNav);
  if (!menuEntry) return [];
  if (typeof menuEntry === 'string') {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Contentstack] primary_navigations is a UID (not resolved). Ensure .includeReference("primary_navigations") is used and the referenced entry is published.');
    }
    return [];
  }
  const navItemsField = menuEntry.navigation_items;
  if (navItemsField && typeof navItemsField === 'object' && 'reference' in navItemsField && Array.isArray(navItemsField.reference)) {
    const uids = navItemsField.reference.map((r) => r.uid).filter(Boolean) as string[];
    return fetchNavigationItemsByUids(stack, uids);
  }
  const items =
    menuEntry.menu_items ??
    menuEntry.items ??
    menuEntry.links ??
    (Array.isArray(navItemsField) ? navItemsField : undefined) ??
    menuEntry.nav_items ??
    menuEntry.menu_links;
  if (!Array.isArray(items)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Contentstack] primary_navigations: no array or reference found. Keys:', Object.keys(menuEntry));
    }
    return [];
  }
  return items.map(mapCSNavItem);
}

/**
 * Fetches the Header global content type and maps it to HeaderData.
 * Expects one published header entry; resolves navigation if reference.
 */
export async function fetchHeader(): Promise<HeaderData | null> {
  try {
    const stack = getStack();
    // includeReference must be on Entries (before .query()); then .query().find() to get first entry
    const result = await stack
      .contentType('header')
      .entry()
      .includeReference('primary_navigations')
      .query()
      .find<CSHeaderEntry>();

    const entries = Array.isArray(result) ? result : (result as { entries?: CSHeaderEntry[] })?.entries ?? [];
    const entry = Array.isArray(entries) ? entries[0] : null;
    if (!entry) {
      if (entries.length === 0) {
        console.warn(
          '[Contentstack] fetchHeader: no entries returned. Check: content type UID is "header", ' +
          'at least one entry is published to your environment, and delivery token has access.'
        );
      }
      return null;
    }

    const raw = entry as unknown as CSHeaderEntry;

    if (process.env.NODE_ENV === 'development') {
      console.log('[Contentstack] fetchHeader: using environment:', environment);
    }

    const logoImageUrl = raw.logo?.url ?? '';
    const navigation = await resolveNavigationFromMenu(stack, raw.primary_navigations);

    const rawSecondary = raw.secondary_links;
    const secondaryList = rawSecondary && typeof rawSecondary === 'object' && 'label' in rawSecondary
      ? [rawSecondary]
      : [];
    const secondary_links = secondaryList.map((s) => ({
      label: s.label ?? '',
      url: hrefFromUrl(s.url) ?? '',
      open_in_new_tab: Boolean(s.open_in_new_tab),
      style: (s.style as 'link' | 'button') ?? 'link',
    }));

    const gf = raw.global_field;
    const primary_cta =
      gf?.label && (gf?.url?.href ?? (gf?.url as CSLinkObj & { url?: string })?.url)
        ? {
          button_text: gf.label,
          button_url: gf.url?.href ?? (gf.url as CSLinkObj & { url?: string })?.url ?? '#',
          open_in_new_tab: false,
          style: 'primary' as const,
        }
        : undefined;

    return {
      title: raw.title,
      logo: {
        image_url: logoImageUrl,
        alt_text: raw.logo?.title ?? raw.logo?.alt_text,
      },
      navigation,
      primary_cta,
      secondary_links: secondary_links.length > 0 ? secondary_links : undefined,
      sticky: raw.sticky,
      show_search: raw.show_search ?? false,
    };
  } catch (e) {
    const err = e as Error & { response?: { status?: number; data?: unknown } };
    console.error('[Contentstack] fetchHeader error:', err?.message ?? e);
    if (err?.response) {
      console.error('[Contentstack] response status:', err.response.status, 'data:', err.response.data);
    }
    return null;
  }
}

/** Raw shapes returned by the landing_page content type */
interface CSHeroSection {
  eyebrow_text?: string;
  main_heading?: string;
  description?: string;
  group?: { global_field?: { label?: string; url?: CSLinkObj } };
  hero_image?: CSFile & { url?: string };
  specifications_cards?: Array<{ value?: string; unit?: string; label?: string }>;
}

interface CSProductSection {
  product_name?: string;
  short_description?: string;
  featured_image?: {
    image?: { url?: string };
    alt?: string;
  };
  features?: { features?: string[] };
}

interface CSHighEfficiencyMotor {
  product_name?: string;
  short_description?: string;
  short_descriptionshort_description?: string;
  image?: {
    alt?: string;
    image?: { url?: string };
  };
}

interface CSAccessoriesFirstSection {
  image?: Array<{ alt?: string; image?: { url?: string } }>;
  group?: { list_title?: string; features?: string[] };
}

interface CSAccessoriesSecondSection {
  global_field?: { label?: string; url?: { href?: string } };
  fearutres?: { title?: string; features?: string[] };
  group?: Array<{ alt?: string; image?: { url?: string } }>;
}

interface CSAccessories {
  title?: string;
  description?: string;
  modular_blocks?: Array<{
    first_section?: CSAccessoriesFirstSection;
    second_section?: CSAccessoriesSecondSection;
  }>;
}

interface CSGallery {
  heading?: string;
  short_description?: string;
  images?: Array<{ overlay_text?: string; alt?: string; image?: { url?: string } }>;
  global_field?: Array<{ label?: string; url?: { href?: string } }>;
}

interface CSColors {
  title?: string;
  short_description?: string;
  banner_image?: { alt?: string; image?: { url?: string } | null };
  colored_images?: { images?: Array<{ alt?: string; image?: { url?: string } }> };
}

interface CSTestimonials {
  heading?: string;
  group?: {
    testimonials?: Array<{
      image?: { url?: string };
      quote?: string;
      name?: string;
      designation?: string;
      rating?: number;
    }>;
  };
}

interface CSLandingPageEntry {
  title?: string;
  /** Slug from API: { title, href } (e.g. Home, /home) */
  slug?: { title?: string; href?: string };
  global_field?: {
    meta_title?: string;
    meta_descriptions?: string;
    no_index?: boolean;
    canonical_url?: string;
    open_graph_image?: string | null;
  };
  page_sections?: Array<{
    hero_section?: CSHeroSection;
    product_section?: CSProductSection;
    high_efficiency_motor?: CSHighEfficiencyMotor;
    accessories?: CSAccessories;
    gallery?: CSGallery;
    colors?: CSColors;
    testmonials?: CSTestimonials;
  }>;
}

export interface LandingPageResult {
  data: LandingPageData;
  raw: unknown;
}

/** Maps one hero_section from API to hero section payload (hero_banner + specs). */
function mapHeroSection(hero: CSHeroSection): LandingPageSection {
  const cta = hero.group?.global_field;
  const heroBanner: HeroBannerData = {
    headline: hero.eyebrow_text ?? '',
    headline_bold: hero.main_heading ?? '',
    description: hero.description ?? '',
    primary_cta: {
      label: cta?.label ?? '',
      url: cta?.url?.href ?? (cta?.url as CSLinkObj)?.url ?? '#',
    },
    product_image: {
      url: hero.hero_image?.url ?? '',
      alt_text: hero.hero_image?.alt_text ?? hero.hero_image?.title,
    },
  };
  const specs: SpecItem[] =
    hero.specifications_cards?.map((card) => ({
      value: (card.value ?? '').trim(),
      unit: card.unit ?? '',
      label: card.label ?? '',
    })) ?? [];
  return { type: 'hero', data: { hero_banner: heroBanner, specs } };
}

/** Maps one product_section from API to product_information section. */
function mapProductSection(ps: CSProductSection): LandingPageSection {
  const data: ProductInformationData = {
    product_name: ps.product_name ?? '',
    short_description: ps.short_description ?? '',
    featured_image: {
      url: ps.featured_image?.image?.url ?? '',
      alt: ps.featured_image?.alt,
    },
    features: ps.features?.features ?? [],
  };
  return { type: 'product_information', data };
}

/** Maps one high_efficiency_motor from API. */
function mapMotorSection(m: CSHighEfficiencyMotor): LandingPageSection {
  const data: HighEfficiencyMotorData = {
    product_name: m.product_name ?? '',
    short_description:
      m.short_description ?? m.short_descriptionshort_description ?? '',
    image: {
      url: m.image?.image?.url ?? '',
      alt: m.image?.alt,
    },
  };
  return { type: 'high_efficiency_motor', data };
}

/** Maps one accessories block from API. */
function mapAccessoriesSection(acc: CSAccessories): LandingPageSection {
  const blocks: AccessoriesBlock[] = [];
  acc.modular_blocks?.forEach((block) => {
    const first = block.first_section;
    if (first) {
      blocks.push({
        type: 'first_section',
        list_title: first.group?.list_title ?? '',
        features: first.group?.features ?? [],
        images: (first.image ?? []).map((img) => ({
          url: img.image?.url ?? '',
          alt: img.alt,
        })),
      });
    }
    const second = block.second_section;
    if (second) {
      const fearutres = second.fearutres;
      blocks.push({
        type: 'second_section',
        title: fearutres?.title ?? '',
        features: fearutres?.features ?? [],
        images: (second.group ?? []).map((item) => ({
          url: item.image?.url ?? '',
          alt: item.alt,
        })),
        cta: second.global_field?.label
          ? {
              label: second.global_field.label,
              url: second.global_field.url?.href ?? '#',
            }
          : undefined,
      });
    }
  });
  const data: AccessoriesData = {
    title: acc.title ?? '',
    description: acc.description ?? '',
    blocks,
  };
  return { type: 'accessories', data };
}

/** Maps one gallery from API. */
function mapGallerySection(g: CSGallery): LandingPageSection {
  const data: GalleryData = {
    heading: g.heading ?? '',
    short_description: g.short_description ?? '',
    images: (g.images ?? []).map((img) => ({
      url: img.image?.url ?? '',
      alt: img.alt,
      overlay_text: img.overlay_text,
    })),
    buttons: (g.global_field ?? []).map((b) => ({
      label: b.label ?? '',
      url: b.url?.href ?? '#',
    })),
  };
  return { type: 'gallery', data };
}

/**
 * Merges consecutive colors blocks into one section: use the block that has
 * title/banner/description for header, and the block with the most color
 * images for thumbnails (avoids duplicate "Colors" section when CMS has
 * one block for banner + one for color list).
 */
function mergeColorsSections(blocks: CSColors[]): LandingPageSection | null {
  if (blocks.length === 0) return null;
  const withBanner = blocks.find((b) => b.banner_image?.image?.url);
  const withTitle = blocks.find((b) => (b.title ?? '').trim() !== '');
  const withMostImages = blocks.reduce(
    (best, b) => {
      const n = (b.colored_images?.images ?? []).filter((img) => img.image?.url).length;
      const bestN = (best?.colored_images?.images ?? []).filter((img) => img.image?.url).length;
      return n >= bestN ? b : best;
    },
    blocks[0]!
  );
  const headerBlock = withTitle ?? withBanner ?? blocks[0]!;
  const title = (headerBlock.title ?? '').trim() || (withTitle?.title ?? '');
  const short_description = (headerBlock.short_description ?? '').trim() || (withTitle?.short_description ?? '');
  const banner_image =
    (withBanner?.banner_image?.image?.url != null && withBanner?.banner_image)
      ? { url: withBanner.banner_image.image!.url!, alt: withBanner.banner_image.alt }
      : undefined;
  const colorOptions: ColorsData['color_options'] = (withMostImages.colored_images?.images ?? [])
    .filter((img) => img.image?.url)
    .map((img, i) => ({
      url: img.image!.url!,
      alt: img.alt,
      index: i + 1,
    }));
  if (!title && !short_description && !banner_image && colorOptions.length === 0)
    return null;
  const data: ColorsData = {
    title: title || 'Colors',
    short_description,
    banner_image,
    color_options: colorOptions,
  };
  return { type: 'colors', data };
}

/** Maps one testmonials block from API. */
function mapTestimonialsSection(t: CSTestimonials): LandingPageSection | null {
  const list = t.group?.testimonials;
  if (!list?.length) return null;
  const data: TestimonialsData = {
    heading: t.heading ?? 'Testimonials',
    testimonials: list.map((item) => ({
      image: { url: item.image?.url ?? '', alt: undefined },
      quote: item.quote ?? '',
      name: item.name ?? '',
      designation: item.designation ?? '',
      rating: item.rating ?? 5,
    })),
  };
  return { type: 'testimonials', data };
}

/**
 * Fetches the singleton Landing Page entry and maps it to LandingPageData.
 * Sections are built in the same order as page_sections in the API.
 * Slug and SEO come from entry.slug and entry.global_field.
 * Note: _metadata appears many times in the raw API because Contentstack adds it to each modular block for tracking — that is expected.
 */
export async function fetchLandingPage(): Promise<LandingPageResult | null> {
  try {
    const stack = getStack();
    const result = await stack
      .contentType('landing_page')
      .entry()
      .query()
      .find();

    const entries = Array.isArray(result) ? result : (result as { entries?: unknown[] })?.entries ?? [];
    const entry = (Array.isArray(entries) ? entries[0] : null) as CSLandingPageEntry | null;

    if (!entry) {
      console.warn(
        '[Contentstack] fetchLandingPage: no entries found. ' +
        'Ensure content type "landing_page" has a published entry and delivery token has access.'
      );
      return null;
    }

    const sections: LandingPageSection[] = [];
    const pageSections = entry.page_sections ?? [];
    let i = 0;
    while (i < pageSections.length) {
      const block = pageSections[i]!;
      if (block.hero_section) {
        sections.push(mapHeroSection(block.hero_section));
        i++;
      } else if (block.product_section) {
        sections.push(mapProductSection(block.product_section));
        i++;
      } else if (block.high_efficiency_motor) {
        sections.push(mapMotorSection(block.high_efficiency_motor));
        i++;
      } else if (block.accessories) {
        sections.push(mapAccessoriesSection(block.accessories));
        i++;
      } else if (block.gallery) {
        sections.push(mapGallerySection(block.gallery));
        i++;
      } else if (block.colors) {
        const colorBlocks: CSColors[] = [];
        while (i < pageSections.length && pageSections[i]?.colors) {
          colorBlocks.push(pageSections[i]!.colors!);
          i++;
        }
        const sec = mergeColorsSections(colorBlocks);
        if (sec) sections.push(sec);
      } else if (block.testmonials) {
        const sec = mapTestimonialsSection(block.testmonials);
        if (sec) sections.push(sec);
        i++;
      } else {
        i++;
      }
    }

    const gf = entry.global_field;
    const seo = gf
      ? {
          meta_title: gf.meta_title,
          meta_description: gf.meta_descriptions,
          canonical_url: gf.canonical_url,
          no_index: gf.no_index,
          open_graph_image: gf.open_graph_image ?? undefined,
        }
      : undefined;

    const slug = entry.slug?.title != null && entry.slug?.href != null
      ? { title: entry.slug.title, href: entry.slug.href }
      : undefined;

    const data: LandingPageData = {
      title: entry.title ?? '',
      slug,
      seo,
      sections,
    };

    return { data, raw: result };
  } catch (e) {
    const err = e as Error & { response?: { status?: number; data?: unknown } };
    console.error('[Contentstack] fetchLandingPage error:', err?.message ?? e);
    if (err?.response) {
      console.error('[Contentstack] response status:', err.response.status, 'data:', err.response.data);
    }
    return null;
  }
}

/**
 * Fetches the Footer global content type and maps it to FooterData.
 * Maps Contentstack shape: footer_columns.links, footer_image (ref), footer_social_links.global_field.
 */
export async function fetchFooter(): Promise<FooterData | null> {
  try {
    const stack = getStack();
    const result = await stack
      .contentType('footer')
      .entry()
      .includeReference('footer_image')
      .query()
      .find<CSFooterEntry>();

    const entries = Array.isArray(result) ? result : (result as { entries?: CSFooterEntry[] })?.entries ?? [];
    const entry = entries[0] ?? null;
    if (!entry) {
      if (entries.length === 0 && process.env.NODE_ENV === 'development') {
        console.warn(
          '[Contentstack] fetchFooter: no entries. Ensure content type "footer" exists, ' +
            'one entry is published, and delivery token has access.'
        );
      }
      return null;
    }

    const raw = entry as unknown as CSFooterEntry;

    // Decorative image: footer_image is a reference to a content type (e.g. "scooter_image")
    // The resolved entry may have the file at .url, .file.url, or nested inside an .image field
    const footerImageList = raw.footer_image ?? [];
    const firstImage = Array.isArray(footerImageList) ? footerImageList[0] : null;
    const img = firstImage as Record<string, unknown> | null;
    const nestedImage = img?.image as { url?: string } | undefined;
    const imageUrl =
      img
        ? (img.url as string | undefined) ??
          (img.file as { url?: string } | undefined)?.url ??
          nestedImage?.url
        : undefined;
    const decorative_image =
      imageUrl
        ? {
            url: imageUrl,
            alt_text:
              (img?.image_alternate_text as string | undefined) ??
              (img?.alt_text as string | undefined),
            title: (img?.title as string | undefined),
          }
        : undefined;

    // Sections: footer_columns.links[] → heading + links[] (title, link.href)
    const columnLinks = raw.footer_columns?.links ?? [];
    const footer_sections = columnLinks.map((section) => ({
      section_heading: section.heading ?? '',
      links: (section.links ?? []).map((link) => ({
        link_text: link.title ?? '',
        link_url: hrefFromUrl(link.link) ?? '#',
      })),
    }));

    // Social: footer_social_links.global_field[] → label (platform), url.href, icon.url
    const socialField = raw.footer_social_links?.global_field ?? [];
    const social_links = socialField.map((item) => {
      const icon = item.icon as { url?: string; file?: { url?: string } } | undefined;
      const iconUrl = icon?.url ?? icon?.file?.url;
      return {
        platform: item.label ?? '',
        url: hrefFromUrl(item.url) ?? '#',
        icon_url: iconUrl ?? undefined,
      };
    });

    return {
      decorative_image: decorative_image ?? undefined,
      footer_sections,
      social_links,
    };
  } catch (e) {
    const err = e as Error & { response?: { status?: number; data?: unknown } };
    console.error('[Contentstack] fetchFooter error:', err?.message ?? e);
    if (err?.response) {
      console.error('[Contentstack] response status:', err.response.status, 'data:', err.response.data);
    }
    return null;
  }
}
