interface ApiDataPrintProps {
  data: unknown;
  title?: string;
}

/**
 * Renders the full API response as formatted JSON so you can see all fields from Contentstack.
 * Note: _metadata { uid } appears on many blocks — Contentstack adds it to each modular block for tracking; that is expected.
 */
export function ApiDataPrint({ data, title = 'API data (raw)' }: ApiDataPrintProps) {
  return (
    <section className="mx-auto max-w-[1440px] px-[50px] py-8">
      <details className="rounded-lg border border-gray-200 bg-gray-50">
        <summary className="cursor-pointer px-4 py-3 font-semibold text-gray-800">
          {title}
        </summary>
        <pre className="overflow-auto p-4 text-xs text-gray-700">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </section>
  );
}
