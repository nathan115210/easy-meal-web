export type NavIconKey = 'home' | 'user' | 'settings' | 'clock' | 'star' | 'utensils';

export interface NavigationItemProps {
  label: string;
  href: string;
  icon: NavIconKey;
}
