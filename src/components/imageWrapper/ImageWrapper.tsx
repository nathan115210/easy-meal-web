'use client';

import { type CSSProperties, memo, useMemo } from 'react';
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

function ImageWrapper({
  alt,
  imageSet,
  priority = false,
  className,
  ariaHidden,
  sizes,
  objectFit = 'cover',
  objectPosition = 'center',
}: ImageWrapperProps) {
  // Use one src so Next can do responsive width selection via sizes/srcSet
  const src = imageSet.desktopSrc ?? imageSet.tabletSrc ?? imageSet.mobileSrc;

  const computedSizes = useMemo(
    () =>
      sizes ??
      ' (max-width: 240px) 81.6192vw,(max-width: 319px) 81.6192vw,(max-width: 360px) 81.6192vw,(max-width: 599px) 81.6192vw,(max-width: 720px) 81.6192vw,(max-width: 1080px) 81.6192vw,(max-width: 600px) 83.712vw,(max-width: 900px) 83.712vw,(max-width: 1200px) 41.856vw,(max-width: 1440px) 41.856vw,(max-width: 1900px) 41.9432vw,1073px',
    [sizes]
  );
  const cls = className ? `${styles.wrap} ${className}` : styles.wrap;

  return (
    <div className={cls} aria-hidden={ariaHidden}>
      <Image
        className={styles.image}
        src={src}
        alt={alt}
        fill
        sizes={computedSizes}
        priority={priority}
        style={{ objectFit, objectPosition }}
      />
    </div>
  );
}

export default memo(ImageWrapper);
