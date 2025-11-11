'use client';

import { type CSSProperties, memo, useMemo } from 'react';
import Image from 'next/image';
import styles from './imageWrapper.module.scss';
import { deviceMediaQueries } from '@/utils/constants/mediaQuery';
import useMediaQuery from '@/utils/hooks/useMediaQuery';

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
  const { mobileSrc, tabletSrc, desktopSrc } = imageSet;

  const isDesktop = useMediaQuery(deviceMediaQueries.desktop);
  const isTablet = useMediaQuery(deviceMediaQueries.tablet);

  const currentSrc = useMemo(() => {
    if (isDesktop === true && desktopSrc) return desktopSrc;
    if (isTablet === true && tabletSrc) return tabletSrc;
    return mobileSrc;
  }, [isDesktop, isTablet, desktopSrc, tabletSrc, mobileSrc]);

  const computedSizes = useMemo(
    () => sizes ?? `${deviceMediaQueries.desktop} 100vw, ${deviceMediaQueries.tablet} 100vw`,
    [sizes]
  );

  const cls = className ? `${styles.wrap} ${className}` : styles.wrap;

  return (
    <div className={cls} aria-hidden={ariaHidden}>
      <Image
        className={styles.image}
        src={currentSrc}
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
