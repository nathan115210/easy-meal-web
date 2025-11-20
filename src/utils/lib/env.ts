export const SERVER_ORIGIN = process.env.SERVER_ORIGIN ?? 'http://localhost:3000';

export const PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export function apiUrl(path: string) {
  if (!path.startsWith('/')) path = `/${path}`;
  return new URL(path, SERVER_ORIGIN).toString();
}
