'use client';

import { useState } from 'react';
import { Link as UiLink } from '@/components/ui/Link';
import { cn } from '@/lib/utils';
import type { FooterData, SocialLink } from '@/types/footer.types';

function getCopyrightText() {
  return `© Copyright ${new Date().getFullYear()}. All rights reserved.`;
}

export interface FooterProps {
  data: FooterData | null;
}

/** Decorative image using native img so it always displays (any domain, no Next/Image config). */
function DecorativeImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div
        className={cn('bg-neutral-600 rounded flex items-end shrink-0 w-full', className)}
        aria-hidden
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn('object-contain object-left-bottom w-full h-full max-w-full', className)}
      onError={() => setError(true)}
    />
  );
}

/** Social icon: use image from CMS when icon_url is set, otherwise platform initial. */
function SocialIconItem({ social, className }: { social: SocialLink; className?: string }) {
  const [imgError, setImgError] = useState(false);
  const useCmsIcon = social.icon_url && !imgError;
  if (useCmsIcon && social.icon_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={social.icon_url}
        alt={social.platform}
        className={cn('size-8 object-contain', className)}
        width={32}
        height={32}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <span className={cn('text-white text-sm font-medium', className)} aria-hidden>
      {social.platform?.slice(0, 1) ?? '?'}
    </span>
  );
}

export function Footer({ data }: FooterProps) {
  const copyrightText = getCopyrightText();
  if (!data) {
    return (
      <footer className="bg-[#363636] py-8 text-center text-white text-sm overflow-x-hidden" role="contentinfo">
        <p>Footer data unavailable (will come from Contentstack).</p>
        <p className="mt-2 text-white/80">{copyrightText}</p>
      </footer>
    );
  }

  const {
    decorative_image,
    footer_sections = [],
    social_links = [],
  } = data;

  const legalsIndex = Math.max(0, footer_sections.length - 1);

  return (
    <footer
      className="relative text-white overflow-hidden w-full md:h-[380px] xl:h-[592px] flex flex-col xl:justify-between mx-auto px-5 mtd:px-16 lg:px-0  mt-10"
      role="contentinfo"
    >
      <div className=" lg:pr-20 xl:pr-24 min-[1440px]:pr-[196px] mt-9 xl:mt-0">
        <div
          className="absolute bottom-0 left-0 right-0 z-0 h-full bg-[#363636] lg:h-[500px] "
          aria-hidden
        />

        {/* Content: flex row = image LEFT + links RIGHT */}
        <div className="relative z-10 flex flex-col pt-8 pb-6 px-5 sm:px-8 md:px-10 lg:px-0 lg:pt-0 lg:pb-0">
          <div
            className={cn(
              'mx-auto w-full max-w-[1440px] xl:justify-end',
              'flex flex-col justify-around lg:items-end gap-8 md:gap-6 lg:gap-10 min-[1440px]:gap-12'
            )}
          >
            {/* LEFT: Decorative image — only visible at xl+ where the 3-col layout has room */}
            <DecorativeImage
              src={decorative_image?.url ?? ""}
              alt={decorative_image?.alt_text ?? decorative_image?.title ?? 'Footer decoration'}
              className="absolute -scale-x-100 rotate-2 -top-4 hidden lg:block xl:block md:w-[370px] md:h-[288px] md:-left-[9%]  xl:w-[690px] xl:h-[511px] xl:-left-[9%] lg:w-[424px] lg:h-[322px]   min-[1440px]:w-[729px] min-[1410px]:h-[551px]"
            />
            {/* RIGHT: Link columns */}
            <div
              className={cn(
                'min-w-0 order-1 md:order-2 justify-around lg:justify-end',
                'lg:mt-10 xl:mt-[190px]',
                'grid gap-6 sm:gap-8 md:gap-14 lg:gap-[60px] min-[1440px]:gap-[100px] xl:gap-20',
                'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
              )}
            >
              {footer_sections.map((section, sectionIndex) => {
                const isLegals = sectionIndex === legalsIndex;
                // const isLastCol = sectionIndex === footer_sections.length - 1;
                return (
                  <div
                    key={`${section.section_heading}-${sectionIndex}`}
                    className={cn(
                      'flex flex-col min-w-0',

                    )}
                  >
                    {/* Headings: Ubuntu 700, 22px desktop, mb-35px; tablet 20px; mobile 18px */}
                    <h3
                      className={cn(
                        'font-bold text-white align-middle tracking-[0]',
                        'text-[1.125rem] leading-[1] mb-6',
                        'md:text-[1.25rem] md:mb-8',
                        'min-[1440px]:text-[22px] min-[1440px]:mb-[35px]'
                      )}
                    >
                      {section.section_heading}
                    </h3>
                    {/* Links: Ubuntu 400, 16px, line-height 54px; tablet 40px; mobile 14px */}
                    <ul className="list-none space-y-0">
                      {(section.links ?? []).map((link, linkIndex) => (
                        <li
                          key={`${link.link_text}-${linkIndex}`}
                          className="leading-[1.5] md:leading-[40px] min-[1440px]:leading-[54px]"
                        >
                          <UiLink
                            href={link.link_url}
                            className={cn(
                              'text-white/90 hover:text-white font-normal',
                              'text-sm md:text-base min-[1440px]:text-base'
                            )}
                          >
                            {link.link_text}
                          </UiLink>
                        </li>
                      ))}
                    </ul>
                    {/* Socials from CMS: 24px from links, 16px gap; icon images from CMS */}
                    {isLegals && social_links.length > 0 && (
                      <div className="flex gap-4 mt-6">
                        {social_links.map((social, i) => (
                          <a
                            key={`${social.platform}-${i}`}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center size-8 rounded-full bg-transparent text-white hover:opacity-80 transition-opacity shrink-0"
                            aria-label={social.platform}
                          >
                            <SocialIconItem social={social} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>


        </div>
      </div>
      {/* Copyright: centered */}
      <div className="mt-8 lg:mt-6 min-[1440px]:mt-6 relative text-center pb-8">
        <div className="mx-auto max-w-[1440px] px-0">
          <p className="text-white/80 text-sm">{copyrightText}</p>
        </div>
      </div>


    </footer>
  );
}
