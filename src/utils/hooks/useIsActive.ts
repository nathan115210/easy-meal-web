'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

function normalize(path: string | null): string {
  if (!path) return '/';
  // strip trailing slash and ignore query/hash
  const clean = path.split('?')[0]!.split('#')[0]!;
  return clean.replace(/\/+$/, '') || '/';
}

function useIsActive() {
  const pathname = usePathname();
  return useMemo(() => {
    return (href: string) => {
      const target = normalize(href);
      return pathname === target || pathname.startsWith(target + '/');
    };
  }, [pathname]);
}

export default useIsActive;
