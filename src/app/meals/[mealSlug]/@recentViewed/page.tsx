'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Meal } from '@/types/meals';
import { extractMealItems } from '@/lib/utils/helpers';
import CardList from '@/components/CardList/CardList';
import type { RecentView } from '@/lib/utils/recentView';
import { getMealsBySlugsClient } from '@/lib/data-client/meals';

export default function RecentViewedPage() {
  const pathname = usePathname();
  const currentSlug = pathname?.split('/').pop() ?? '';
  const [recentViewedMealsSlugs, setRecentViewedMealsSlugs] = React.useState<string[]>([]);
  const [recentViewedMeals, setRecentViewedMeals] = useState<Meal[]>([]);

  //Read from localStorage (and subscribe for live updates)
  useEffect(() => {
    const KEY = process.env.NEXT_PUBLIC_RECENT_VIEWS_STORAGE_KEY || '';
    if (!KEY) {
      throw new Error('Environment variable NEXT_PUBLIC_RECENT_VIEWS_STORAGE_KEY is not defined');
    }
    const load = () => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const viewedList = JSON.parse(raw) as RecentView[];
          // filter out the current meal slug
          const filteredList: RecentView[] = viewedList.filter((item) => item.mealSlug !== currentSlug && !!item.mealSlug);

          if (filteredList.length > 0) {
            // Sort by viewedAt descending and extract mealSlugs
            const sortedMeals = filteredList.sort((a, b) => b.viewedAt - a.viewedAt).map((item) => item.mealSlug);
            setRecentViewedMealsSlugs(sortedMeals);
          }
        }
      } catch (error) {
        console.error('Failed to parse recent viewed meals from localStorage', error);
        setRecentViewedMealsSlugs([]);
        return;
      }
    };

    load(); // initial load

    let bc: BroadcastChannel | null = null;
    let onStorage: ((this: Window, ev: StorageEvent) => void) | null = null;
    let onMessage: EventListener | null = null;

    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(KEY);
      onMessage = (e: Event) => {
        const data = (e as MessageEvent).data;
        console.log('[BC] received', data);
        load();
      };
      bc.addEventListener('message', onMessage);
    } else {
      onStorage = function (this: Window, e: StorageEvent) {
        if (e.key === KEY) load();
      };
      window.addEventListener('storage', onStorage);
    }
    return () => {
      // If we created a BroadcastChannel and attached a message handler,
      // explicitly remove the listener before closing the channel.
      // This ensures the handler is fully detached and avoids memory leaks.
      if (bc && onMessage) {
        bc.removeEventListener('message', onMessage);
        bc.close(); // free resources (browser keeps a system-level pipe open otherwise)
      }

      // If we fell back to the 'storage' event, remove that listener as well.
      // Without this, React’s Fast Refresh or remounting could lead to duplicate calls.
      if (onStorage) {
        window.removeEventListener('storage', onStorage);
      }
    };
  }, [currentSlug]);

  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        // Ensure current slug not included, double check in case of safety
        const slugs = recentViewedMealsSlugs.filter((s) => s !== currentSlug);
        if (slugs.length === 0) {
          setRecentViewedMeals([]);
          return;
        }
        const data = await getMealsBySlugsClient(slugs);
        if (!abort) setRecentViewedMeals(data);
      } catch {
        if (!abort) setRecentViewedMeals([]);
      }
    })();
    return () => {
      abort = true;
    };
  }, [currentSlug, recentViewedMealsSlugs]);
  console.log('recentViewedMeals', recentViewedMeals);
  return (
    <section id={'recently-viewed-meals'}>
      <CardList items={extractMealItems(recentViewedMeals)} heading="Recently viewed" />
    </section>
  );
}
