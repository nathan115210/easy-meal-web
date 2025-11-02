// Robustly get the current pathname in a server component (Next 16 compatible)
import { headers } from 'next/headers';

async function getCurrentPathname(): Promise<string> {
  const h = await headers();

  const url = h.get('x-url');
  if (url) {
    try {
      return new URL(url).pathname;
    } catch {
      /* ignore */
    }
  }

  const proto = h.get('x-forwarded-proto') ?? 'https';
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost';
  const forwardedUri = h.get('x-forwarded-uri');

  if (forwardedUri) {
    try {
      return new URL(`${proto}://${host}${forwardedUri}`).pathname;
    } catch {
      /* ignore */
    }
  }
  return '/';
}

export default getCurrentPathname;
