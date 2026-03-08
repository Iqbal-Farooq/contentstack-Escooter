'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types/navigation.types';

interface MobileMenuProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ items, isOpen, onClose }: MobileMenuProps) {
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);

  const toggle = (label: string) => {
    setExpandedLabel((prev) => (prev === label ? null : label));
  };

  return (
    <div
      className={cn(
        'fixed inset-0 top-[var(--header-height,4rem)] z-40 bg-white lg:hidden',
        isOpen ? 'block' : 'hidden'
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
    >
      <nav className="border-t border-neutral-200 px-4 py-4" aria-label="Primary">
        <ul className="flex flex-col gap-0">
          {items.map((item) => {
            const subItems = item.sub_navigation_items ?? [];
            const hasChildren = item.has_dropdown && subItems.length > 0;
            const isExpanded = expandedLabel === item.label;

            return (
              <li key={item.label} className="border-b border-neutral-100">
                {hasChildren ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggle(item.label)}
                      className="flex w-full items-center justify-between py-3 text-left text-[14px] font-normal leading-none tracking-normal text-[#42454A]"
                      aria-expanded={isExpanded}
                      aria-controls={`mobile-sub-${item.label.replace(/\s/g, '-')}`}
                    >
                      {item.label}
                      <span
                        className={cn(
                          'transition-transform',
                          isExpanded && 'rotate-180'
                        )}
                      >
                        ▾
                      </span>
                    </button>
                    <ul
                      id={`mobile-sub-${item.label.replace(/\s/g, '-')}`}
                      className={cn(
                        'overflow-hidden border-t border-neutral-100 bg-neutral-50 pl-4',
                        isExpanded ? 'max-h-96' : 'max-h-0'
                      )}
                      role="group"
                    >
                      {subItems.map((sub) => (
                        <li key={sub.label + sub.url}>
                          <Link
                            href={sub.url}
                            target={sub.open_in_new_tab ? '_blank' : undefined}
                            rel={
                              sub.open_in_new_tab
                                ? 'noopener noreferrer'
                                : undefined
                            }
                            onClick={onClose}
                            className="block py-2.5 text-[14px] font-normal leading-none tracking-normal text-[#42454A] hover:text-neutral-900"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.url ?? '#'}
                    target={item.open_in_new_tab ? '_blank' : undefined}
                    rel={
                      item.open_in_new_tab ? 'noopener noreferrer' : undefined
                    }
                    onClick={onClose}
                    className="block py-3 text-[14px] font-normal leading-none tracking-normal text-[#42454A] hover:text-neutral-900"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
