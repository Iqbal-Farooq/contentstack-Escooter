import NextLink from 'next/link';
import { cn } from '@/lib/utils';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  openInNewTab?: boolean;
}

export function Link({
  href,
  children,
  className,
  openInNewTab,
}: LinkProps) {
  return (
    <NextLink
      href={href}
      target={openInNewTab ? '_blank' : undefined}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      className={cn('text-neutral-700 hover:text-neutral-900 underline-offset-4 hover:underline', className)}
    >
      {children}
    </NextLink>
  );
}
