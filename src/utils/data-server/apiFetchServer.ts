import 'server-only';

type ApiFetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  /**
   * ISR revalidation in seconds.
   * - number → ISR with that interval
   * - false → fully dynamic (no-store)
   * - undefined → default (300s)
   */
  revalidate?: number | false;
  tags?: string[];
};

function getBaseURL() {
  // Prefer a server-only base URL; fall back to public/VERCEL_URL if needed.
  const env =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL;

  if (!env) return 'http://localhost:3000';

  // If it's already a full URL, use as-is. Otherwise, treat as a host/domain.
  return env.startsWith('http') ? env : `https://${env}`;
}

/*
* Usage: const nav = await apiFetchServer<NavResponse>('/api/navigation');

* const nav = await apiFetchServer<NavResponse>('/api/navigation', {
  revalidate: 600,
  tags: ['navigation'],
});
*
* await apiFetchServer<void>('/api/meals', {
  method: 'POST',
  body: { title: 'New meal' },
  revalidate: false, // dynamic
});
* */

export default async function apiFetchServer<T>(
  path: string,
  opts: ApiFetchOptions = {}
): Promise<T> {
  const baseURL = getBaseURL();

  // Ensure path is relative to root (e.g. "/api/foo")
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const url = new URL(normalizedPath, baseURL);

  const { method = 'GET', body, headers = {}, revalidate, tags } = opts;

  const isJsonBody = body !== undefined && !(body instanceof FormData);

  const init: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  } = {
    method,
    headers: {
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...(isJsonBody ? { body: JSON.stringify(body) } : {}),
  };

  // Cache / ISR behavior
  if (revalidate === false) {
    // Fully dynamic
    init.cache = 'no-store';
  } else {
    // Static with ISR
    init.next = {
      revalidate: revalidate ?? 300,
      tags,
    };
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    let message = `API error ${res.status} ${res.statusText} for ${normalizedPath}`;
    try {
      const text = await res.text();
      if (text) {
        message += ` – response: ${text.slice(0, 200)}`;
      }
    } catch {
      // ignore body-read errors
    }
    throw new Error(message);
  }

  // If the endpoint returns no content
  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}
