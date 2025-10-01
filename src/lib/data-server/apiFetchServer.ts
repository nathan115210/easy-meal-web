// Server-only fetch helper with ISR + tags.

import 'server-only';

function getBaseURL() {
  // Works locally and on Vercel. Prefer setting NEXT_PUBLIC_BASE_URL in both.
  const env = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL;
  const url = env?.startsWith('http') ? env : env ? `https://${env}` : '';
  return url || 'http://localhost:3000';
}

export default async function apiFetchServer<T>(path: string, opts?: { revalidate?: number; tags?: string[] }) {
  const res = await fetch(new URL(path, getBaseURL()), {
    // Enable ISR + tag-based revalidation on the *fetch* cache
    next: { revalidate: opts?.revalidate ?? 300, tags: opts?.tags },
  });
  if (!res.ok) throw new Error(`API error ${res.status} for ${path}`);
  return (await res.json()) as T;
}
