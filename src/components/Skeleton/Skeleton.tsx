import React from 'react';
import styles from './skeleton.module.scss';

type SkeletonVariant = 'section' | 'text' | 'block' | 'paragraph' | 'circle' | 'rect';
type SkeletonSize = 'sm' | 'md' | 'lg';

type SkeletonProps = {
  variant?: SkeletonVariant;
  size?: SkeletonSize;
  lines?: number; // for paragraph
  className?: string;
  style?: React.CSSProperties;
};

const SIZE_MAP: Record<SkeletonVariant, Record<SkeletonSize, number>> = {
  section: { sm: 320, md: 480, lg: 720 },
  text: { sm: 80, md: 120, lg: 180 },
  block: { sm: 120, md: 200, lg: 320 },
  paragraph: { sm: 80, md: 120, lg: 180 },
  circle: { sm: 24, md: 40, lg: 64 },
  rect: { sm: 60, md: 100, lg: 160 },
};

export default function Skeleton({
                                   variant = 'block',
                                   size = 'md',
                                   lines = 3,
                                   className = '',
                                   style = {},
                                 }: SkeletonProps) {
  const resolvedSize = SIZE_MAP[variant][size];

  if (variant === 'paragraph') {
    return (
      <div className={`${styles['skeleton__paragraph']} ${className}`} style={style}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={styles['skeleton__text']}
            style={{ width: resolvedSize }}
          />
        ))}
      </div>
    );
  }

  let skeletonClass = styles['skeleton'];
  if (variant === 'text') skeletonClass = styles['skeleton__text'];
  if (variant === 'block') skeletonClass = styles['skeleton__block'];
  if (variant === 'circle') skeletonClass = styles['skeleton__circle'];
  if (variant === 'rect') skeletonClass = styles['skeleton__rect'];
  if (variant === 'section') skeletonClass = styles['skeleton__section'];

  const dimensionProps =
    variant === 'circle'
      ? { width: resolvedSize, height: resolvedSize }
      : { width: resolvedSize };

  return (
    <div
      className={`${skeletonClass} ${className}`}
      style={{
        ...dimensionProps,
        ...style,
      }}
    />
  );
}