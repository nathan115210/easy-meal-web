export interface MainHeaderData {
  logo: {
    imgSrc: string;
    alt: string;
  };
  navLinks: Array<{
    href: string;
    label: string;
    ariaLabel: string;
  }>;
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
  ],
  navAriaLabel: 'Main navigation',
};
