'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types/navigation.types';

interface NavDropdownProps {
  item: NavItem;
  className?: string;
}

export function NavDropdown({ item, className }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const subItems = item.sub_navigation_items ?? [];
  const hasChildren = item.has_dropdown && subItems.length > 0;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const linkContent = (
    <>
      <span>{item.label}</span>
      {hasChildren && (
        <span
          className="ml-0.5 inline-block transition-transform"
          aria-hidden
        >
          ▾
        </span>
      )}
    </>
  );

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.url && !hasChildren ? (
        <Link
          href={item.url}
          target={item.open_in_new_tab ? '_blank' : undefined}
          rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
          className="flex items-center py-2 text-[14px] font-normal leading-none tracking-normal text-[#42454A] hover:text-neutral-900"
        >
          {linkContent}
        </Link>
      ) : (
        <span
          className="flex cursor-default items-center py-2 text-[14px] font-normal leading-none tracking-normal text-[#42454A] hover:text-neutral-900"
          aria-haspopup="true"
          aria-expanded={open}
          id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}-trigger`}
        >
          {linkContent}
        </span>
      )}

      {hasChildren && (
        <div
          className={cn(
            'absolute left-0 top-full z-50 min-w-[180px] rounded-md border border-neutral-200 bg-white py-1 shadow-lg transition-opacity',
            open ? 'visible opacity-100' : 'invisible opacity-0'
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}-trigger`}
        >
          {subItems.map((sub) => (
            <Link
              key={sub.label + sub.url}
              href={sub.url}
              target={sub.open_in_new_tab ? '_blank' : undefined}
              rel={sub.open_in_new_tab ? 'noopener noreferrer' : undefined}
              role="menuitem"
              className="block px-4 py-2 text-[14px] font-normal leading-none tracking-normal text-[#42454A] hover:bg-neutral-50 hover:text-neutral-900"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
