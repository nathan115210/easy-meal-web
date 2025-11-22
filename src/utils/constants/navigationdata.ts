import { NavigationItemProps } from '@/components/navigation/navigationTypes';

const navigationData: { main: NavigationItemProps[]; shortcuts: NavigationItemProps[] } = {
  main: [
    { label: 'Home', href: '/', icon: 'home' },
    { label: 'Browse Meals', href: '/meals', icon: 'utensils' },
    { label: 'Profile', href: '/profile', icon: 'user' },
    { label: 'Settings', href: '/settings', icon: 'settings' },
  ],
  shortcuts: [
    { label: 'Dinner in 30', href: '/dinner', icon: 'clock' },
    { label: 'Top Rated', href: '/top-rated', icon: 'star' },
  ],
};

export default navigationData;
