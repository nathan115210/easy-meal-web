import styles from './card.module.scss';
import ImageWrapper, { ImageSetType } from '@/components/imageWrapper/ImageWrapper';
import { ReactNode } from 'react';
import Chip from '@/components/chip/Chip';

export interface CardProps {
  imageSet?: ImageSetType;
  imageAlt?: string;
  heading?: string;
  cookTime?: number;
  children?: ReactNode;
}

//TODO: render the cookTime
function Card({ imageSet, heading, imageAlt, children, cookTime }: CardProps) {
  const cookTimeLabel = cookTime ? `${cookTime} min` : undefined;

  return (
    <div className={`${styles.card} ${cookTimeLabel ? styles['card-withOverlay'] : ''}`}>
      {cookTimeLabel && (
        <Chip
          className={styles.cardTag}
          label={cookTimeLabel}
          type="label"
          size={'md'}
          variant={'muted'}
        />
      )}
      {/*Image*/}
      {imageSet && imageAlt && (
        <ImageWrapper className={styles.cardImg} imageSet={imageSet} alt={imageAlt} />
      )}

      {(children || heading) && (
        <div className={styles.content}>
          {/*heading*/}
          {heading && <h3 className={styles.heading}>{heading}</h3>}

          {children}
        </div>
      )}
    </div>
  );
}

export default Card;
