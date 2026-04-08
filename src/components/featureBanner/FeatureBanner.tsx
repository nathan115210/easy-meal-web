import styles from './featureBanner.module.scss';
import ImageWrapper, { ImageSetType } from '@/components/imageWrapper/ImageWrapper';
import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export type FeatureBannerVariant = 'overlayLeft' | 'overlayBottom' | 'split';

export interface FeatureBannerProps {
  heading: string;
  description: string;
  imageSet: ImageSetType;
  imageAlt: string;
  icon?: ReactNode;
  ctaText?: string;
  ctaHref?: string;
  variant?: FeatureBannerVariant;
  className?: string;
}

function FeatureBanner({
  heading,
  description,
  imageSet,
  imageAlt,
  icon,
  ctaText,
  ctaHref,
  variant = 'overlayBottom',
  className,
}: FeatureBannerProps) {
  const ctaIcon =
    variant === 'overlayLeft' ? (
      <ArrowUpRight size={18} aria-hidden="true" />
    ) : variant === 'split' ? (
      <ArrowRight size={16} aria-hidden="true" />
    ) : (
      <ChevronRight size={16} aria-hidden="true" />
    );

  if (variant === 'split') {
    return (
      <div className={clsx(styles.banner, styles.split, className)}>
        <div className={styles.splitContent}>
          {icon && <div className={styles.icon}>{icon}</div>}
          <h3 className={styles.heading}>{heading}</h3>
          <p className={styles.description}>{description}</p>
          {ctaText && ctaHref && (
            <Link href={ctaHref} className={styles.ctaLink}>
              {ctaText}
              {ctaIcon}
            </Link>
          )}
        </div>
        <div className={styles.splitImage}>
          <div className={styles.splitImageInner}>
            <ImageWrapper imageSet={imageSet} alt={imageAlt} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        styles.banner,
        variant === 'overlayLeft' ? styles.overlayLeft : styles.overlayBottom,
        className
      )}
    >
      <div className={styles.imageWrap}>
        <ImageWrapper imageSet={imageSet} alt={imageAlt} />
      </div>
      <div
        className={clsx(
          styles.gradient,
          variant === 'overlayLeft' ? styles.gradientLeft : styles.gradientBottom
        )}
        aria-hidden="true"
      />
      <div className={styles.overlayContent}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <h3 className={styles.heading}>{heading}</h3>
        <p className={styles.description}>{description}</p>
        {ctaText && ctaHref && (
          <Link href={ctaHref} className={styles.ctaLink}>
            {ctaText}
            {ctaIcon}
          </Link>
        )}
      </div>
    </div>
  );
}

export default FeatureBanner;
