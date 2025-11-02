import React from 'react';
import styles from './skeleton.module.scss';

type Size = number | string;
type CSSVar = string | number | undefined;

export type DeviceType = 'mobile' | 'tablet' | 'desktop'; // (if you need it elsewhere)

export type SkeletonProps = {
  variant?: 'rect' | 'text' | 'circle' | 'pill';
  /** width/height accept numbers (px) or css strings (e.g., "100%", "2rem") */
  width?: Size;
  height?: Size;
  /** border radius (px or css string). Ignored for circle. */
  radius?: Size;
  /** text lines (for variant="text") */
  lines?: number;
  /** disable shimmer animation */
  shimmer?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function toCssSize(v?: Size): string | undefined {
  if (v === undefined) return undefined;
  return typeof v === 'number' ? `${v}px` : v;
}

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

export default function Skeleton({
  variant = 'rect',
  width,
  height,
  radius,
  lines = 3,
  shimmer = true,
  className,
  style,
}: SkeletonProps) {
  const baseStyle: React.CSSProperties = {
    ...style,
    ['--sk-width' as any]: toCssSize(width),
    ['--sk-height' as any]: toCssSize(height),
    ['--sk-radius' as any]: variant === 'circle' ? '9999px' : toCssSize(radius),
  };

  if (variant === 'text') {
    const arr = Array.from({ length: Math.max(1, lines) });
    return (
      <div aria-hidden="true" className={cx(styles.skeletonGroup, className)} style={baseStyle}>
        {arr.map((_, i) => {
          // Make the last line shorter for realism
          const lineWidth = i === arr.length - 1 ? '60%' : '100%';
          return (
            <span
              key={i}
              className={cx(styles.skeleton, shimmer && styles.shimmer, styles.textLine)}
              style={{ ['--sk-line-width' as any]: lineWidth }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cx(
        styles.skeleton,
        shimmer && styles.shimmer,
        variant === 'pill' && styles.pill,
        className
      )}
      style={baseStyle}
    />
  );
}

/* Convenience subcomponents */
Skeleton.Text = function Text(props: Omit<SkeletonProps, 'variant'> & { lines?: number }) {
  return <Skeleton variant="text" {...props} />;
};

Skeleton.Circle = function Circle(
  props: Omit<SkeletonProps, 'variant' | 'width' | 'height' | 'radius'> & { size?: Size }
) {
  const { size = 40, ...rest } = props;
  return <Skeleton variant="circle" width={size} height={size} {...rest} />;
};

Skeleton.Rect = function Rect(props: Omit<SkeletonProps, 'variant'>) {
  return <Skeleton variant="rect" {...props} />;
};

Skeleton.Pill = function Pill(props: Omit<SkeletonProps, 'variant' | 'radius'>) {
  return <Skeleton variant="pill" {...props} />;
};
