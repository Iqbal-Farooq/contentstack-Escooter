/**
 * Generic fetch wrapper for server-side requests.
 * Use for API routes or fallback when SDK is not used.
 */

export interface FetcherOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function fetcher<T>(
  url: string,
  options: FetcherOptions = {}
): Promise<T> {
  const { params, ...init } = options;
  const search = params
    ? '?' + new URLSearchParams(params).toString()
    : '';
  const res = await fetch(`${url}${search}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }

  return res.json() as Promise<T>;
}
