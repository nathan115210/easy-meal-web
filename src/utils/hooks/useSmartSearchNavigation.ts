'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { applySmartSearchToParams } from '@/utils/lib/applySmartSearchToParams';
import { SmartSearchOptionsState } from '@/utils/types/meals';

export function useSmartSearchNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = useCallback(
    (options: SmartSearchOptionsState) => {
      // Start from current query params so we preserve things like ?search=burger
      const base = new URLSearchParams(searchParams?.toString() ?? '');

      const nextParams = applySmartSearchToParams(base, options);

      const query = nextParams.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      router.push(url, { scroll: false });
    },
    [router, searchParams, pathname]
  );

  return { handleSearch };
}
