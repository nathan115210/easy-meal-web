'use client';
import React, { FC, useMemo } from 'react';
import Image from 'next/image';
import Cta from '@/components/Cta/Cta';
import { CtaVariants } from '@/components/Cta/ctaType';
import styles from './grid.module.scss';
import Card, { type CardProps } from '@/components/Card/Card';

export interface GridProps {
  heading?: string;
  items: CardProps[];
  featuredId?: string;
  enableFeatured?: boolean;
}

const Grid: FC<GridProps> = ({ items, featuredId, heading, enableFeatured = true }) => {
  const {
    featuredItem,
    otherItems,
  }: {
    featuredItem: CardProps | null;
    otherItems: CardProps[];
  } = useMemo(() => {
    if (!enableFeatured) return { featuredItem: null, otherItems: items };
    const featuredItem = items.find((item) => item.id === featuredId) || items[0];
    const otherItems = items.filter((item) => item.id !== featuredItem.id);
    return { featuredItem, otherItems };
  }, [items, featuredId, enableFeatured]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.grid}>
      {heading && <h2 className={styles.grid__heading}>{heading}</h2>}

      {featuredItem && (
        <div className={styles.grid__featured}>
          {featuredItem.imageUrl && (
            /*   <div className={styles.grid__featured_image}>
                                         <Image src={featuredItem.imageUrl} alt={featuredItem.title} width={16} height={9} objectFit="cover" layout="responsive" />
                                       </div>*/
            <div className={styles.grid__featured_image}>
              {/*<Image
                                src={featuredItem.imageUrl}
                                alt={featuredItem.title}
                                width={400}
                                height={300}
                            />*/}
              <Image className={styles['grid__card-image']} src={featuredItem.imageUrl} alt={featuredItem.title} width={400} height={300} />
            </div>
          )}
          <div className={styles.grid__featured_content}>
            <h3 className={styles.grid__featured_title}>{featuredItem.title}</h3>
            {featuredItem.description && <p className={styles.grid__featured_desc}>{featuredItem.description}</p>}
            {featuredItem.href && (
              <Cta href={featuredItem.href} variant={CtaVariants.Primary}>
                Learn More
              </Cta>
            )}
          </div>
        </div>
      )}

      <ul className={styles.grid__list}>
        {otherItems.map((item) => {
          const { id, title, imageUrl, description, href } = item;

          return <Card key={id} id={id} title={title} imageUrl={imageUrl} description={description} href={href} />;
        })}
      </ul>
    </section>
  );
};

export default Grid;
