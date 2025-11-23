'use client';

import type { ButtonHTMLAttributes, MouseEvent } from 'react';
import { forwardRef, memo } from 'react';
import styles from './button.module.scss';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'primary-outline'
  | 'secondary-outline'
  | 'ghost'
  | 'destructive';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'compact';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  loading?: boolean; // shows spinner, sets aria-busy
  loadingText?: string; // SR-only text while loading
  pressed?: boolean; // toggle state for aria-pressed
  iconOnly?: boolean; // requires aria-label when true
};

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    className,
    type = 'button',
    loading = false,
    loadingText = 'Loading…',
    pressed,
    iconOnly = false,
    onClick,
    disabled = false,
    children,
    ...rest
  },
  ref
) {
  const isLoading = Boolean(loading);
  const isDisabled = Boolean(disabled);

  // Dev-only guard for icon-only buttons
  if (process.env.NODE_ENV !== 'production') {
    const ariaLabel = (rest as Record<string, unknown>)['aria-label'];
    if (iconOnly && (typeof ariaLabel !== 'string' || ariaLabel.trim().length === 0)) {
      console.warn('Button: `iconOnly` requires an accessible label via `aria-label`.');
    }
  }

  const variantClass = styles[`button--${variant}`] ?? styles['button--primary'];
  const sizeClass =
    size === 'md' ? undefined : (styles[`button--${size}` as keyof typeof styles] ?? undefined);

  const cls = cx(
    styles.button,
    variantClass,
    sizeClass,
    iconOnly && styles['button--icon-only'],
    isLoading && styles['is-loading'],
    className
  );

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled || isLoading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cls}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={isLoading || undefined}
      aria-pressed={pressed}
      onClick={handleClick}
      {...rest}
    >
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}

      {/* If icon-only + loading, we can hide children visually */}
      {!(isLoading && iconOnly) && <span aria-hidden={isLoading || undefined}>{children}</span>}

      {isLoading && (
        <span className={styles['sr-only']} role="status" aria-live="polite">
          {loadingText}
        </span>
      )}
    </button>
  );
});

export default memo(Button);
