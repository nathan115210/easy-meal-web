import React from 'react';
import Grid, {GridItemProps} from '@/components/Grid/Grid';
import styles from './meals.module.scss';

const mealItems: GridItemProps[] = [
    {
        id: 'meal1',
        title: 'Grilled Chicken Salad',
        description: 'Fresh greens with grilled chicken, avocado, and vinaigrette.',
        imageUrl: '/meals/dummy-1.png',
        href: '/meals/grilled-chicken-salad',
    },
    {
        id: 'meal2',
        title: 'Vegan Buddha Bowl',
        description: 'Quinoa, roasted veggies, chickpeas, and tahini sauce.',
        imageUrl: '/meals/dummy-2.png',
        href: '/meals/vegan-buddha-bowl',
    },
    {
        id: 'meal3',
        title: 'Pasta Primavera',
        description: 'Whole wheat pasta with seasonal vegetables and pesto.',
        imageUrl: '/meals/dummy-3.png',
        href: '/meals/pasta-primavera',
    },
];

const MealsPage = () => {
    return (
        <section className={styles.mealsPage}>
            <h1 className={styles.mealsHeading}>Our Meals</h1>
            <p className={styles.mealsDescription}>
                Discover delicious, healthy meals crafted for every lifestyle.
            </p>
            <Grid items={mealItems} heading="All Meals" enableFeatured={false}/>
        </section>
    );
};

export default MealsPage;