import { type CSSProperties, memo } from 'react';
import Image from 'next/image';
import styles from './imageWrapper.module.scss';

export type ImageSetType = {
  mobileSrc: string;
  tabletSrc?: string;
  desktopSrc?: string;
};

type ImageWrapperProps = {
  alt: string;
  imageSet: ImageSetType;
  priority?: boolean;
  className?: string;
  ariaHidden?: boolean;
  sizes?: string;
  objectFit?: CSSProperties['objectFit'];
  objectPosition?: CSSProperties['objectPosition'];
};

const DEFAULT_SIZES = '(min-width: 1200px) 50vw, 100vw';

function ImageWrapper({
  alt,
  imageSet,
  priority = false,
  className,
  ariaHidden,
  sizes = DEFAULT_SIZES,
  objectFit = 'cover',
  objectPosition = 'center',
}: ImageWrapperProps) {
  const src = imageSet.desktopSrc ?? imageSet.tabletSrc ?? imageSet.mobileSrc;
  const cls = className ? `${styles.wrap} ${className}` : styles.wrap;

  return (
    <div className={cls} aria-hidden={ariaHidden}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit, objectPosition }}
      />
    </div>
  );
}

export default memo(ImageWrapper);
