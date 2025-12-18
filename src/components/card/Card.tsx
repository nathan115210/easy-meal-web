import styles from './card.module.scss';
import ImageWrapper, { ImageSetType } from '@/components/imageWrapper/ImageWrapper';
import { ReactNode } from 'react';
import Chip from '@/components/chip/Chip';

export interface CardProps {
  imageSet?: ImageSetType;
  imageAlt?: string;
  heading?: string;
  label?: string;
  children?: ReactNode;
}

function Card({ imageSet, heading, imageAlt, children, label, ...rest }: CardProps) {
  return (
    <div className={`${styles.card} ${label ? styles['card-withOverlay'] : ''}`} {...rest}>
      {label && (
        <Chip className={styles.cardTag} label={label} type="label" size={'md'} variant={'muted'} />
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
