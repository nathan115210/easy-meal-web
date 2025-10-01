'use client';

import { useEffect } from 'react';
import { addRecentMeal } from '@/lib/utils/recentView';

export default function RecentViewRecorder({ mealSlug }: { mealSlug: string }) {
  useEffect(() => {
    // TODO: call addRecentMeal() after user scrolled for 300ms
    // to avoid recording meals that are not actually viewed
    if (!mealSlug) return; // skip if no mealSlug provided
    
    const t = setTimeout(() => {
      addRecentMeal({ mealSlug });
    }, 2000);
    return () => clearTimeout(t);
  }, [mealSlug]);
  return null;
}
