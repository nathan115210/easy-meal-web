import React, {PropsWithChildren} from 'react';
import type {Metadata} from "next";

type MealDetailsLayoutProps = PropsWithChildren<{
    params: Promise<{ mealSlug: string }>
}>;

export async function generateMetadata({params}: { params: Promise<{ mealSlug: string }> }): Promise<Metadata> {
    const {mealSlug} = await params;
    return {
        title: `Easy meal - ${mealSlug}`
    };
}

export default async function MealDetailsLayout({children, params}: MealDetailsLayoutProps) {
    const {mealSlug} = await params;
    return (
        <div>
            <h1>Meal Details: {mealSlug}</h1>
            {children}
        </div>
    );
}