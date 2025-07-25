import React from 'react';
import styles from './skeleton.module.scss';

type SkeletonVariant = 'section' | 'text' | 'block' | 'paragraph' | 'circle' | 'rect';
type SkeletonSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

type SkeletonProps = {
  variant?: SkeletonVariant;
  size?: SkeletonSize;
  lines?: number; // for paragraph
  className?: string;
  style?: React.CSSProperties;
};

const SIZE_MAP: Record<SkeletonVariant, Record<SkeletonSize, string>> = {
  section: { sm: '2.5rem', md: '5rem', lg: '7.5rem', xl: '9rem', full: '100%' },
  text: { sm: '2rem', md: '4rem', lg: '6rem', xl: '8rem', full: '100%' },
  block: { sm: '3rem', md: '5rem', lg: '8rem', xl: '9.5rem', full: '100%' },
  paragraph: { sm: '2rem', md: '4rem', lg: '6rem', xl: '8rem', full: '100%' },
  circle: { sm: '1rem', md: '2rem', lg: '3rem', xl: '4rem', full: '100%' },
  rect: { sm: '1.5rem', md: '3rem', lg: '5rem', xl: '10rem', full: '100%' },
};

export default function Skeleton({ variant = 'block', size = 'md', lines = 3, className = '', style = {} }: SkeletonProps) {
  const resolvedSize = SIZE_MAP[variant][size];

  if (variant === 'paragraph') {
    return (
      <div className={`${styles['skeleton__paragraph']} ${className}`} style={style}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={styles['skeleton__text']} style={{ width: resolvedSize }}></div>
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

  const dimensionProps = variant === 'circle' ? { width: resolvedSize, height: resolvedSize } : { width: resolvedSize };

  return (
    <div
      className={`${skeletonClass} ${className}`}
      style={{
        ...dimensionProps,
        ...style,
      }}
    ></div>
  );
}
