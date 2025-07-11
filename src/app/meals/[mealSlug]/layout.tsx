import React from 'react'
import type {Metadata} from "next";

export async function generateMetadata({params}: { params: { mealSlug: string } }): Promise<Metadata> {
    const mealSlug = await params.mealSlug;
    return {
        title: `Easy meal - ${mealSlug}`
    };
}

export default function MealDetailsLayout({children}: { children: React.ReactNode }) {
    return <div>
        <h1>Meal Details Page</h1>
        {children}
    </div>;
}
