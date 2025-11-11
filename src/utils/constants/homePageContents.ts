import { BannerImagePositionType, BannerProps } from '@/components/banner/Banner';
import { LinkProps } from '@/components/baseLink/BaseLink';
import { ButtonProps } from '@/components/button/Button';

type CtaGroupItemType = (LinkProps | ButtonProps) & { type: 'link' | 'button' };

type FeatureItemType = BannerProps & { link: LinkProps };

interface HomePageContentsProps {
  heroBanner: BannerProps & { ctaGroup?: CtaGroupItemType[] };
  featuresSection: FeatureItemType[];
}

const homePageContents: HomePageContentsProps = {
  heroBanner: {
    heading: 'Welcome to Our Website',
    description: 'Discover amazing content and connect with others.',
    bannerImageSet: {
      mobileSrc: '/placeholder.png',
      tabletSrc: '/placeholder-tablet.svg',
      desktopSrc: '/placeholder-desktop.svg',
    },
    bannerImageAlt: 'Hero banner showing a scenic view',
    imagePosition: BannerImagePositionType.RIGHT,
    ctaGroup: [
      {
        type: 'link',
        href: '/get-started',
        variant: 'primary',
        underline: 'hover',
        pressed: true,
        children: 'Start Planning',
      },
      {
        type: 'button',
        variant: 'secondary',
        children: 'Browse Recipes',
      },
    ],
  },
  featuresSection: [
    {
      heading: 'Smart Recipe Search',
      description:
        'Describe what you have on hand and get tailored recipes. Understand substitutions and dietary fits instantly.',
      bannerImageSet: {
        mobileSrc: '/placeholder.png',
        tabletSrc: '/placeholder-tablet.svg',
        desktopSrc: '/placeholder-desktop.svg',
      },
      bannerImageAlt:
        'Smart Recipe Search — describe ingredients to get tailored recipes with substitutions and dietary suggestions.',
      link: {
        href: '/get-started',
        pressed: true,
        children: 'Try It Now',
      },
    },
    {
      heading: 'Weekly Planner & Reminders',
      description:
        'Drag recipes into a weekly calendar and get prep reminders so dinner is on time, every time.',
      bannerImageSet: {
        mobileSrc: '/placeholder.png',
        tabletSrc: '/placeholder-tablet.svg',
        desktopSrc: '/placeholder-desktop.svg',
      },
      bannerImageAlt:
        'Weekly planner and reminders — schedule recipes in a calendar and receive prep reminders.',
      link: {
        href: '/get-started',
        pressed: true,
        children: 'Start Planning',
      },
    },
    {
      heading: 'One-Click Shopping Lists',
      description:
        'Turn any plan into a clean grocery list grouped by aisle, ready to share or check off in-store.',
      bannerImageSet: {
        mobileSrc: '/placeholder.png',
        tabletSrc: '/placeholder-tablet.svg',
        desktopSrc: '/placeholder-desktop.svg',
      },
      bannerImageAlt:
        'One-click shopping lists — generate aisle-grouped grocery lists from your meal plans.',
      link: {
        href: '/get-started',
        pressed: true,
        children: 'Go Shopping List',
      },
    },
    {
      heading: 'Community Reviews & Tips',
      description:
        'See what real cooks say. Save tips, tweaks, and ratings to make every recipe your own.',
      bannerImageSet: {
        mobileSrc: '/placeholder.png',
        tabletSrc: '/placeholder-tablet.svg',
        desktopSrc: '/placeholder-desktop.svg',
      },
      bannerImageAlt:
        'Community reviews and tips — read cook reviews, tips, and ratings to customize recipes.',
      link: {
        href: '/get-started',
        pressed: true,
        children: 'Check It Out',
      },
    },
  ],
};

export default homePageContents;
