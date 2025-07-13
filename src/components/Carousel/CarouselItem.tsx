'use client';

import React, {FC} from 'react';
import Image from 'next/image';
import Cta from '@/components/Cta/Cta';
import styles from './carousel.module.scss';
import {CtaSizes, CtaVariants} from "@/components/Cta/ctaType";

export interface CarouselItemProps {
    title: string;
    imageUrl: string;
    altText: string;
    description?: string;
    href?: string;
}

const CarouselItem: FC<CarouselItemProps> = ({title, imageUrl, description, href, altText}: CarouselItemProps) => {
    return (
        <div className={styles['carousel-item']}>
            <div className={styles['carousel-item-image']}>
                <Image
                    src={imageUrl}
                    alt={altText}
                    fill
                    style={{objectFit: 'cover'}}
                    sizes="100vw"
                />
            </div>
            {/*<div className={styles['carousel-item-image']}>
            </div>*/}
            <div className={styles['carousel-item-content']}>
                <h3>{title}</h3>
                {description && <p>{description}</p>}
                {href && (
                    <Cta href={href} variant={CtaVariants.Secondary} size={CtaSizes.Small} className="carousel-link">
                        Learn More
                    </Cta>
                )}
            </div>
        </div>
    );
};

export default CarouselItem;
