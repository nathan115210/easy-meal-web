import styles from './card.module.scss';
import ImageWrapper, { ImageSetType } from '@/components/imageWrapper/ImageWrapper';
import { ReactNode } from 'react';

export interface CardProps {
  imageSet?: ImageSetType;
  imageAlt?: string;
  heading?: string;
  description?: string;
  children?: ReactNode;
}

function Card({ imageSet, description, heading, imageAlt, children }: CardProps) {
  return (
    <div className={styles.card}>
      {/*Image*/}
      {imageSet && imageAlt && (
        <ImageWrapper className={styles.cardImg} imageSet={imageSet} alt={imageAlt} />
      )}
      {/*heading*/}

      {/*Content*/}

      {(description || children || heading) && (
        <div className={styles.content}>
          {heading && <h3 className={styles.heading}>{heading}</h3>}
          {description}
          {children}
        </div>
      )}
    </div>
  );
}

export default Card;
