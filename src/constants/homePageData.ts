export const introSectionContent: {
  heading: string;
  description: string;
  features: string[];
  cta: {
    ctaText: string;
    ctaLink: string;
  };
} = {
  heading: 'Fuel Your Day with Easy Meal',
  description:
    'Plan, cook, and shop effortlessly with personalized meal recommendations, a dynamic planner, and auto-generated lists.',
  features: [
    'Smart Recipe Search',
    'Weekly Planner & Reminders',
    'One-Click Shopping Lists',
    'Community Reviews & Tips',
  ],
  cta: {
    ctaText: 'Check All Meals',
    ctaLink: '/meals',
  },
};

export const featureGridItems = [
  {
    id: 'shopping',
    title: 'One-Click Shopping Lists',
    imageUrl: '/shopping-list.png',
    href: '/features/shopping-list',
  },
  {
    id: 'search',
    title: 'Smart Recipe Search',
    imageUrl: '/smart-search-1.png',
    href: '/features/search',
  },
  {
    id: 'planner',
    title: 'Weekly Planner & Reminders',
    imageUrl: '/planner.png',
    description: 'Schedule your meals and get cooking reminders.',
    href: '/features/planner',
  },

  {
    id: 'community',
    title: 'Community Reviews & Tips',
    imageUrl: '/community.png',
    href: '/features/community',
  },
];
