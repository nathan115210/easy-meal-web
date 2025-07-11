import React from 'react';
import './IntroSection.scss';
import Cta from '@/components/Cta/Cta';
import {CtaVariants} from '@/components/Cta/ctaType';
import Image from 'next/image'
import Grid, {GridItemProps} from '../Grid/Grid';


export default function IntroSection() {
    return (
        <section className="intro-section">
            <h1>Fuel Your Day with Easy Meal</h1>
            <div className="intro-container">
                <div className="intro-image">

                    {/*<img src="/images/intro-hero.png" alt="Happy family cooking together"/>*/}
                    <Image src={'/bowl.png'} alt={'Fuel Your Day'} width={300} height={300}/>
                </div>

                <div className="intro-copy">
                    <p>
                        Plan, cook, and shop effortlessly with personalized meal
                        recommendations, a dynamic planner, and auto-generated lists.
                    </p>

                    <ul className="features">
                        <li>🔍 Smart Recipe Search</li>
                        <li>🗓️ Weekly Planner & Reminders</li>
                        <li>🛒 One-Click Shopping Lists</li>
                        <li>⭐ Community Reviews & Tips</li>
                    </ul>

                    <Cta href="/meals" variant={CtaVariants.Primary}>
                        Get Started
                    </Cta>
                </div>
            </div>

            <Grid items={items} featuredId="planner" heading={'featured'}/>
        </section>
    );
}


const items: GridItemProps[] = [
    {
        id: 'search',
        title: 'Smart Recipe Search',
        imageUrl: '/intro-image.png',
        description: 'Find recipes based on ingredients, cuisine, and dietary needs.',
        href: '/features/search',
    },
    {
        id: 'planner',
        title: 'Weekly Planner & Reminders',
        imageUrl: '/intro-image.png',
        description: 'Schedule your meals and get cooking reminders.',
        href: '/features/planner',
    },
    {
        id: 'shopping',
        title: 'One-Click Shopping Lists',
        imageUrl: '/intro-image.png',

        description: 'Generate a shopping list from your planned recipes.',
        href: '/features/shopping-list',
    },
    {
        id: 'community',
        title: 'Community Reviews & Tips',
        imageUrl: '/intro-image.png',
        description: 'Read and share tips with fellow home cooks.',
        href: '/features/community',
    },
]
