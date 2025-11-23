export type NavIconKey =
  | 'home'
  | 'user'
  | 'settings'
  | 'clock'
  | 'star'
  | 'utensils'
  | 'scan-search';

export interface NavigationItemProps {
  label: string;
  href: string;
  icon: NavIconKey;
}
