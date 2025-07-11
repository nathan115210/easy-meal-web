'use client';
import React, {FC, useMemo} from 'react';
import Image from 'next/image';
import Cta from '@/components/Cta/Cta';
import {CtaVariants} from '@/components/Cta/ctaType';
import './Grid.scss';
import GridCard from "@/components/Grid/GridCard";

export interface GridItemProps {
    id: string;
    title: string;
    imageUrl: string;
    description?: string;
    href?: string;
}

export interface GridProps {
    heading?: string;
    items: GridItemProps[];
    featuredId?: string;
    enableFeatured?: boolean;
}

const Grid: FC<GridProps> = ({items, featuredId, heading, enableFeatured = true}) => {

    if (items.length === 0) {
        return null;
    }


    const {featuredItem, otherItems}: {
        featuredItem: GridItemProps | null;
        otherItems: GridItemProps[]
    } = useMemo(() => {
        if (!enableFeatured) return {featuredItem: null, otherItems: items};
        const featuredItem = items.find(item => item.id === featuredId) || items[0];
        const otherItems = items.filter(item => item.id !== featuredItem.id);
        return {featuredItem, otherItems};
    }, [items, featuredId, enableFeatured]);

    return (
        <section className="grid">
            {heading && <h2 className="grid__heading">{heading}</h2>}

            {featuredItem && <div className="grid__featured">
                {featuredItem.imageUrl && (
                    <div className="grid__featured-image">
                        <Image
                            src={featuredItem.imageUrl}
                            alt={featuredItem.title}
                            width={16}
                            height={9}
                            objectFit="cover"
                            layout="responsive"
                        />
                    </div>
                )}
                <div className='grid__featured-content'>

                    <h3 className="grid__featured-title">{featuredItem.title}</h3>
                    {featuredItem.description && (
                        <p className="grid__featured-desc">{featuredItem.description}</p>
                    )}
                    {featuredItem.href && (
                        <Cta href={featuredItem.href} variant={CtaVariants.Primary}>
                            Learn More
                        </Cta>
                    )}
                </div>
            </div>}

            <ul className="grid__list">
                {otherItems.map(item => {
                    const {id, title, imageUrl, description, href} = item;
                    return (
                        <GridCard
                            key={id}
                            id={id}
                            title={title}
                            imageUrl={imageUrl}
                            description={description}
                            href={href}
                        />
                    );
                })}
            </ul>
        </section>
    );
};

export default Grid;
