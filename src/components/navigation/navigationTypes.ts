export type NavIconKey = 'home' | 'user' | 'settings' | 'clock' | 'star';

export interface NavigationItemPros {
  label: string;
  href: string;
  icon: NavIconKey;
}
