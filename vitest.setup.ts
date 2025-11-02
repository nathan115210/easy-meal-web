import '@testing-library/jest-dom/vitest';
import 'whatwg-fetch'; // fetch() in jsdom
import React from 'react';
import { vi } from 'vitest';

type NextImageProps = import('next/image').ImageProps;
type StaticImageData = import('next/image').StaticImageData;

// next/image → plain <img> so RTL can find it
vi.mock('next/image', () => {
  const MockNextImage: React.FC<NextImageProps> = ({ src, alt, ...rest }) => {
    // Accept string or imported static image
    const resolved = typeof src === 'string' ? src : (src as StaticImageData).src;

    return React.createElement('img', { src: resolved, alt, ...rest });
  };

  return { __esModule: true, default: MockNextImage };
});

// App Router hooks used in unit tests
vi.mock('next/navigation', async () => {
  // Provide only what you use; extend as needed
  return {
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      prefetch: vi.fn(),
    }),
  };
});

// Server-only APIs: provide dummies if some component imports them in unit tests
vi.mock('next/headers', () => {
  return {
    headers: () => new Headers(),
    cookies: () => ({
      get: () => undefined,
      set: () => {},
      delete: () => {},
      getAll: () => [],
    }),
  };
});

/** next/link → plain <a> */
vi.mock('next/link', () => {
  type Props = React.PropsWithChildren<
    React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
  >;

  const Link: React.FC<Props> = ({ href, children, ...rest }) =>
    React.createElement('a', { href, ...rest }, children);

  return { __esModule: true, default: Link };
});

/** lucide-react/dynamic → stub DynamicIcon */
vi.mock('lucide-react/dynamic', () => ({
  __esModule: true,
  DynamicIcon: ({ name }: { name: string }) => React.createElement('i', { 'data-icon': name }),
}));
