export type NavIconKey = 'home' | 'user' | 'settings' | 'clock' | 'star';

export interface NavigationItemProps {
  label: string;
  href: string;
  icon: NavIconKey;
}
