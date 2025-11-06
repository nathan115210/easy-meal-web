import { NextResponse } from 'next/server';
import { NavigationItemProps } from '@/components/navigation/navigationTypes';

const main: NavigationItemProps[] = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Profile', href: '/profile', icon: 'user' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
];

const shortcuts: NavigationItemProps[] = [
  { label: 'Dinner in 30', href: '/dinner', icon: 'clock' },
  { label: 'Top Rated', href: '/top-rated', icon: 'star' },
];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function getNavigationData() {
  await sleep(200); // reduced to 200ms to avoid blocking SSR
  return { main, shortcuts };
}

export async function GET() {
  const data = await getNavigationData();
  return NextResponse.json(data);
}
