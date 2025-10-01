import React, { FC } from 'react';
import Image from 'next/image';
import styles from './card.module.scss';
import { CtaVariants } from '@/components/Cta/ctaType';
import Cta from '@/components/Cta/Cta';

export interface CardProps {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  href?: string;
  direction?: 'row' | 'column';
}

const Card: FC<CardProps> = ({ href, title, imageUrl, description, direction = 'column' }) => {
  const cardClassName = direction === 'row' ? `${styles.card} ${styles.card_row}` : styles.card;
  
  return (
    <div className={cardClassName}>
      <div className={styles['image-container']}>
        <Image src={imageUrl} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className={styles['card_image']} />
      </div>
      <div className={styles['card_content']}>
        <h3 className={styles['card_content-title']}>{title}</h3>
        {description && <p className={styles['card_content-desc']}>{description}</p>}
        {href && (
          <Cta href={href} variant={CtaVariants.Secondary} className={styles.card_cta}>
            Learn More
          </Cta>
        )}
      </div>
    </div>
  );
};
export default Card;
