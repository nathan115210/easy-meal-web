import { NextResponse } from 'next/server';
import { NavigationItemPros } from '@/components/navigation/navigationTypes';

const main: NavigationItemPros[] = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Profile', href: '/profile', icon: 'user' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
];

const shortcuts: NavigationItemPros[] = [
  { label: 'Dinner in 30', href: '/dinner', icon: 'clock' },
  { label: 'Top Rated', href: '/top-rated', icon: 'star' },
];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function getNavigationData() {
  await sleep(5000); // keep small; 5000ms blocks SSR
  return { main, shortcuts };
}

export async function GET() {
  const data = await getNavigationData();
  return NextResponse.json(data);
}
