import '@testing-library/jest-dom/vitest';
import 'whatwg-fetch'; // fetch() in jsdom
import React from 'react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { mswServer } from '@/utils/test/unit-test/msw/mswServer';
import { cleanup } from '@testing-library/react';

type NextImageProps = import('next/image').ImageProps;

beforeAll(() => mswServer.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
  mswServer.resetHandlers();
  cleanup();
});
afterAll(() => {
  mswServer.close();
});

// next/image → plain <img> so RTL can find it
vi.mock('next/image', () => {
  const MockNextImage = (props: NextImageProps) => {
    const { priority, placeholder, loader, unoptimized, ...imgProps } = props;
    return React.createElement('img', imgProps as React.ImgHTMLAttributes<HTMLImageElement>);
  };

  return { __esModule: true, default: MockNextImage };
});

// App Router hooks used in unit tests
vi.mock('next/navigation', async () => {
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
