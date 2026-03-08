import { type ClassValue, clsx } from 'clsx';

/**
 * Merge class names with Tailwind-friendly conflict resolution.
 * Uses clsx for conditional classes; add tailwind-merge in production if needed.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
