import { ImageSetType } from '@/components/imageWrapper/ImageWrapper';
import { FeatureBannerVariant } from '@/components/featureBanner/FeatureBanner';

export type TrendingRecipeItem = {
  id: number;
  title: string;
  imageSet: ImageSetType;
  imageAlt: string;
  time: string;
  difficulty: string;
  category: string;
  href: string;
};

export type FeatureBannerIconName = 'search' | 'calendar' | 'shopping-cart' | 'message-square';

export type FeatureBannerItem = {
  heading: string;
  description: string;
  imageSet: ImageSetType;
  imageAlt: string;
  ctaText: string;
  ctaHref: string;
  iconName: FeatureBannerIconName;
  variant: FeatureBannerVariant;
};

interface HomePageContentsProps {
  hero: {
    eyebrow: string;
    heading: string;
    headingEmphasis: string;
    ctaText: string;
    ctaHref: string;
  };
  trendingRecipes: TrendingRecipeItem[];
  featureBanners: FeatureBannerItem[];
}

const homePageContents: HomePageContentsProps = {
  hero: {
    eyebrow: 'The Art of Modern Cooking',
    heading: 'Refined planning for the',
    headingEmphasis: 'intentional',
    ctaText: 'Explore Recipes',
    ctaHref: '/meals',
  },
  trendingRecipes: [
    {
      id: 1,
      title: 'Miso Glazed Black Cod',
      imageSet: {
        mobileSrc:
          'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
      },
      imageAlt: 'Miso glazed black cod on a ceramic plate',
      time: '25 min',
      difficulty: 'Easy',
      category: 'Trending',
      href: '/meals/1',
    },
    {
      id: 2,
      title: 'Hand-Pulled Biang Biang Noodles',
      imageSet: {
        mobileSrc:
          'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800',
      },
      imageAlt: 'Hand-pulled Biang Biang noodles in a bowl with chilli oil',
      time: '45 min',
      difficulty: 'Medium',
      category: "Editor's Choice",
      href: '/meals/2',
    },
    {
      id: 3,
      title: 'Burrata with Heirloom Tomatoes',
      imageSet: {
        mobileSrc:
          'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=800',
      },
      imageAlt: 'Burrata cheese with heirloom tomatoes and basil on a wooden board',
      time: '15 min',
      difficulty: 'Beginner',
      category: 'Seasonal',
      href: '/meals/3',
    },
  ],
  featureBanners: [
    {
      heading: 'Smart Recipe Search',
      description:
        "Find inspiration by what's already in your pantry. Filter by cuisine, diet, or complexity with our concierge-guided search engine.",
      imageSet: {
        mobileSrc:
          'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1600',
      },
      imageAlt: 'A chef preparing food in a bright modern kitchen',
      ctaText: 'Try Smart Discovery',
      ctaHref: '/meals',
      iconName: 'search',
      variant: 'overlayLeft',
    },
    {
      heading: 'Planner & Reminders',
      description:
        'A balanced calendar for your life. Get timely prep notifications and never forget an ingredient again.',
      imageSet: {
        mobileSrc:
          'https://images.unsplash.com/photo-1435527173128-983b87201f4d?auto=format&fit=crop&q=80&w=800',
      },
      imageAlt: 'Weekly planner open on a desk with a coffee cup',
      ctaText: 'View Planner',
      ctaHref: '/get-started',
      iconName: 'calendar',
      variant: 'overlayBottom',
    },
    {
      heading: 'One-Click Lists',
      description:
        'Efficiency meets refinement. Instantly generate organised checklists from your weekly plan and export to any device.',
      imageSet: {
        mobileSrc:
          'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
      },
      imageAlt: 'Fresh vegetables and produce at a grocery market',
      ctaText: 'Manage Lists',
      ctaHref: '/get-started',
      iconName: 'shopping-cart',
      variant: 'overlayBottom',
    },
    {
      heading: 'Community & Tips',
      description:
        'A curated collection of wisdom. Share feedback, discover shortcuts, and learn from a community of fellow cooks.',
      imageSet: {
        mobileSrc:
          'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
      },
      imageAlt: 'People cooking together in a shared kitchen',
      ctaText: 'Join the Conversation',
      ctaHref: '/get-started',
      iconName: 'message-square',
      variant: 'split',
    },
  ],
};

export default homePageContents;
