import React, { FC } from 'react';
import { GridItemProps } from '@/components/Grid/Grid';
import Image from 'next/image';
import styles from './grid.module.scss';
import { CtaVariants } from '@/components/Cta/ctaType';
import Cta from '@/components/Cta/Cta';

const GridCard: FC<GridItemProps> = ({ href, title, imageUrl, description }) => {
  return (
    <li className={styles.grid__card}>
      {imageUrl && <Image className={styles['grid__card-image']} src={imageUrl} alt={title} width={400} height={300} />}
      <div className={styles['grid__card-content']}>
        <h3 className={styles['grid__card-content-title']}>{title}</h3>
        {description && <p className={styles['grid__card-content-desc']}>{description}</p>}
        {href && (
          <Cta href={href} variant={CtaVariants.Secondary}>
            Learn More
          </Cta>
        )}
      </div>
    </li>
  );
};
export default GridCard;
