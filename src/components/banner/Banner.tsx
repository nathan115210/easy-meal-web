import { JSX, memo, ReactNode } from 'react';
import styles from './banner.module.scss';
import ImageWrapper, { type ImageSetType } from '@/components/imageWrapper/ImageWrapper';

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
  bannerImageAlt?: string;
  children?: ReactNode;
};
function Banner({
  heading,
  headingLevel = 'h1',
  bannerImageSet,
  description,
  imagePosition = BannerImagePositionType.LEFT,
  bannerImageAlt = 'Banner image',
  children,
}: BannerProps) {
  const HeadingTag = headingLevel as keyof JSX.IntrinsicElements;

  const bannerCls = [
    styles.banner,
    imagePosition === BannerImagePositionType.RIGHT ? styles.imageOnRight : '',
  ].join(' ');

  return (
    <div className={bannerCls}>
      <ImageWrapper
        className={styles.imageWrap}
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
