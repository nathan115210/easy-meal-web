import type {GridItemProps} from '@/components/Grid/Grid';
import {CarouselItemProps} from "@/components/Carousel/CarouselItem";

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
    description: 'Plan, cook, and shop effortlessly with personalized meal recommendations, a dynamic planner, and auto-generated lists.',
    features: ['Smart Recipe Search', 'Weekly Planner & Reminders', 'One-Click Shopping Lists', 'Community Reviews & Tips'],
    cta: {
        ctaText: 'Check All Meals',
        ctaLink: '/meals',
    },
};


export const carouselItems: CarouselItemProps[] = [
    {
        title: 'Smart Recipe Search',
        imageUrl: '/intro-image.png',
        altText: 'Smart Recipe Search',
        description: 'Filter by ingredient, cuisine, diet, or cook time—and get top-rated matches based on your pantry.',
        href: '/learn-more-1',
    },
    {
        title: 'Weekly Planner & Reminders',
        imageUrl: '/bowl-inllustration.png',
        altText: 'Weekly Planner & Reminders',
        description: 'Drag-and-drop meals into your calendar and set alerts so you’re never scrambling at dinner time.',
        href: '/learn-more-2',
    },
    {
        title: 'One-Click Shopping Lists',
        imageUrl: '/bowl-inllustration.png',
        altText: 'One-Click Shopping Lists',
        description: 'Auto-generate aisle-grouped lists from your plan—no duplicates, ready to print or share.',
        href: '/learn-more-2',
    },
    {
        title: 'Community Reviews & Tips',
        imageUrl: '/bowl-inllustration.png',
        altText: 'Community Reviews & Tips',
        description: 'Drag-and-drop meals into your calendar and set alerts so you’re never scrambling at dinner time.',
        href: '/learn-more-2',
    },
];


export const featureGridItems: GridItemProps[] = [
    {
        id: 'shopping',
        title: 'One-Click Shopping Lists',
        imageUrl: '/shopping-list.png',
        description: 'Generate a shopping list from your planned recipes.',
        href: '/features/shopping-list',
    },
    {
        id: 'search',
        title: 'Smart Recipe Search',
        imageUrl: '/smart-search-1.png',
        description: 'Find recipes based on ingredients, cuisine, and dietary needs.',
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
        description: 'Read and share tips with fellow home cooks.',
        href: '/features/community',
    },
];
