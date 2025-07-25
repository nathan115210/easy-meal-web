import type { NavLinkProps } from '@/components/MainHeader/NavLink';
import { CtaVariants } from '@/components/Cta/ctaType';

export interface MainHeaderData {
  logo: {
    imgSrc: string;
    alt: string;
  };
  navLinks: Array<NavLinkProps>;
  navAriaLabel: string;
}

export const mainHeaderData: MainHeaderData = {
  logo: {
    imgSrc: '/logo.svg',
    alt: 'Easy Meal Logo',
  },
  navLinks: [
    { href: '/', label: 'Home', ariaLabel: 'Go to Home page' },
    { href: '/meals', label: 'Meals', ariaLabel: 'Go to Meals page' },
    { href: '/community', label: 'Community', ariaLabel: 'Go to Community page' },
    { href: '/create-meal', label: 'Create', ariaLabel: 'Go to Create meal page', variant: CtaVariants.Secondary },
  ],
  navAriaLabel: 'Main navigation',
};
