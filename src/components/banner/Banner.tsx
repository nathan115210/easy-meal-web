import { JSX, memo, ReactNode } from 'react';
import styles from './banner.module.scss';
import ImageWrapper, { type ImageSetType } from '@/components/imageWrapper/ImageWrapper';
import clsx from 'clsx';

export enum BannerImagePositionType {
  LEFT = 'left',
  RIGHT = 'right',
}
export type BannerHeadingLevelType = 'h1' | 'h2' | 'h3';

export type BannerProps = {
  heading: string;
  headingLevel?: BannerHeadingLevelType;
  description: string;
  bannerImageSet: ImageSetType;
  imagePosition?: BannerImagePositionType;
  bannerImageAlt: string;
  children?: ReactNode;
  className?: string;
};
function Banner({
  heading,
  headingLevel = 'h1',
  bannerImageSet,
  description,
  imagePosition = BannerImagePositionType.LEFT,
  bannerImageAlt = 'Banner image',
  className,
  children,
}: BannerProps) {
  const HeadingTag = headingLevel as keyof JSX.IntrinsicElements;

  const bannerCls = clsx(
    styles.banner,
    imagePosition === BannerImagePositionType.RIGHT && styles.imageOnRight,
    className || ''
  );

  return (
    <div className={bannerCls}>
      <ImageWrapper
        className={styles.imgWrapper}
        ariaHidden
        alt={bannerImageAlt}
        imageSet={bannerImageSet}
        priority
      />

      <div className={styles.contentContainer}>
        <HeadingTag>{heading}</HeadingTag>
        <div className={styles.description}>{description}</div>
        {children}
      </div>
    </div>
  );
}

export default memo(Banner);
