import Link from 'next/link';

/** Static 404 page for output: 'export'. Must not use dynamic APIs. */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold text-neutral-800">Page not found</h1>
      <p className="text-neutral-500">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Go home
      </Link>
    </div>
  );
}
