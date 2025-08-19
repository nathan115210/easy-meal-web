export type RecentView = {
  mealSlug: string;
  viewedAt: number;
};

//TODO: (If calling addRecentMeal very frequently, consider a singleton channel you reuse and close on app unmount. For your use (one post per page view), closing immediately is perfect.)

export function addRecentMeal({ mealSlug }: { mealSlug: string }) {
  const KEY = process.env.NEXT_PUBLIC_RECENT_VIEWS_STORAGE_KEY || '';
  if (!KEY) {
    throw new Error('Environment variable NEXT_PUBLIC_RECENT_VIEWS_STORAGE_KEY is not defined');
  }

  const MAX_ITEMS = 12;
  const DEDUPE_MS = 1000 * 60 * 2; // ignore re-views within 2 minutes

  const now = Date.now();
  let viewedList: RecentView[] = [];

  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      viewedList = JSON.parse(raw) as RecentView[];
    }
  } catch {
    console.error('Failed to parse recent viewed meals from localStorage');
    viewedList = [];
  }
  // Deduplicate and ignore if viewed very recently
  const idx = viewedList.findIndex((x) => x.mealSlug === mealSlug);
  if (idx >= 0) {
    if (now - viewedList[idx].viewedAt < DEDUPE_MS) return; // too soon, skip
    viewedList.splice(idx, 1); // remove old occurrence so we can move it to front
  }

  // Add the current meal for the front of the list with the latest viewedAt timestamp
  viewedList.unshift({ mealSlug, viewedAt: now });

  // Limit length
  viewedList = viewedList.slice(0, MAX_ITEMS);

  // Save back
  localStorage.setItem(KEY, JSON.stringify(viewedList));

  // Notify other tabs/components to live-update
  if (typeof BroadcastChannel !== 'undefined') {
    const bc = new BroadcastChannel(KEY);
    const msg = { type: 'recentViews/update', slug: mealSlug, at: now };
    console.log('[BroadcastChannel] posting', msg);
    bc.postMessage(msg);
    bc.close();
  }
}
