'use client';
import { useEffect, useState } from 'react';

export default function useDeviceType(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange(); // initial
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
