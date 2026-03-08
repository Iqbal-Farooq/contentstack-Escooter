'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Link as UiLink } from '@/components/ui/Link';
import { NavDropdown } from '@/components/navigation/NavDropdown';
import { MobileMenu } from '@/components/navigation/MobileMenu';
import type { HeaderData } from '@/types/header.types';

const HEADER_HEIGHT = '4rem';

export interface HeaderProps {
  data: HeaderData;
}

/** Log header data shape for schema analysis (dev only). */
function logHeaderDataSchema(data: HeaderData): void {
  if (typeof window === 'undefined') return;
  console.log('[Header] Contentstack schema — data shape for header:', JSON.stringify(data, null, 2));
}

export function Header({ data }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logo, navigation, primary_cta, secondary_links, sticky } = data;

  useEffect(() => {
    logHeaderDataSchema(data);
  }, [data]);

  return (
    <>
      <header
        className={cn(
          'z-50 w-full border-b border-neutral-200 bg-white',
          sticky && 'sticky top-0'
        )}
        style={{ ['--header-height' as string]: HEADER_HEIGHT }}
        role="banner"
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 xl:px-[50px] ">
          {/* Left: Logo */}
          <div className="flex shrink-0">
            {logo.link_url ? (
              <Link
                href={logo.link_url}
                className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
                aria-label={logo.alt_text ?? 'Home'}
              >
                <LogoImage logo={logo} />
              </Link>
            ) : (
              <span className="flex items-center" aria-hidden>
                <LogoImage logo={logo} />
              </span>
            )}
          </div>

          {/* Center: Desktop navigation */}
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Primary navigation"
          >
            <ul className="flex list-none gap-8">
              {navigation.map((item) => (
                <li key={item.label}>
                  <NavDropdown item={item} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Secondary links + CTA */}
          <div className="flex shrink-0 items-center gap-4">
            {secondary_links?.map((link) => (
              <UiLink
                key={link.label + link.url}
                href={link.url}
                openInNewTab={link.open_in_new_tab}
                className="hidden rounded-md px-4 py-2 text-sm font-medium sm:inline-block"
              >
                {link.label}
              </UiLink>
            ))}
            {primary_cta && (
              <Button
                asChild
                href={primary_cta.button_url}
                openInNewTab={primary_cta.open_in_new_tab}
                variant={primary_cta.style === 'secondary' ? 'secondary' : 'primary'}
                className="hidden sm:inline-flex"
              >
                {primary_cta.button_text}
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="sr-only">{mobileOpen ? 'Close' : 'Menu'}</span>
              {mobileOpen ? (
                <span className="text-xl" aria-hidden>✕</span>
              ) : (
                <span className="text-xl" aria-hidden>☰</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-nav">
        <MobileMenu
          items={navigation}
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      </div>


    </>
  );
}

function LogoImage({
  logo,
}: {
  logo: { image_url: string; alt_text?: string };
}) {
  if (!logo.image_url) {
    return (
      <span className="text-lg font-semibold text-neutral-900">
        Logo
      </span>
    );
  }
  return (
    <Image
      src={logo.image_url}
      alt={logo.alt_text ?? 'Logo'}
      width={120}
      height={48}
      className="h-10 w-auto object-contain"
      priority
      unoptimized={logo.image_url.includes('contentstack')}
    />
  );
}
