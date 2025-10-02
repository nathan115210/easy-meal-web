'use client';

import React, { forwardRef, KeyboardEvent, MouseEvent } from 'react';
import Link from 'next/link';
import cls from './chip.module.scss';

export type ChipColor = 'primary' | 'secondary' | 'neutral' | 'brand';
export type ChipVariant = 'filled' | 'outline';
type ChipSize = 'sm' | 'md';

export interface ChipProps {
  label: string;
  color?: ChipColor;
  variant?: ChipVariant;
  size?: ChipSize;
  onClick?: (e: MouseEvent | KeyboardEvent) => void;
  onDelete?: (e: MouseEvent | KeyboardEvent) => void;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  className?: string;
  id?: string;
  href?: string;
  'aria-label'?: string;
  prefetch?: boolean;
}

function handleKey(
  e: KeyboardEvent,
  onClick?: ChipProps['onClick'],
  onDelete?: ChipProps['onDelete'],
  disabled?: boolean
) {
  if (disabled) return;
  if ((e.key === 'Enter' || e.key === ' ') && onClick) {
    e.preventDefault();
    onClick(e);
  }
  if ((e.key === 'Backspace' || e.key === 'Delete') && onDelete) {
    e.preventDefault();
    onDelete(e);
  }
}

export const Chip = forwardRef<HTMLElement, ChipProps>(function Chip(
  {
    label,
    color = 'primary',
    variant = 'filled',
    size = 'md',
    onClick,
    onDelete,
    disabled,
    leadingIcon,
    className,
    id,
    href,
    prefetch,
    'aria-label': ariaLabel,
  },
  ref
) {
  const clickable = (!!onClick || !!href) && !disabled;
  const baseClass = [
    cls.chip,
    cls[`c_${color}`],
    cls[`v_${variant}`],
    cls[`s_${size}`],
    disabled ? cls.disabled : '',
    clickable ? cls.clickable : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {leadingIcon && <span className={cls.icon}>{leadingIcon}</span>}
      <span className={cls.label}>{label}</span>
      {onDelete && (
        <button
          type="button"
          className={cls.deleteBtn}
          aria-label={`Remove ${label}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) onDelete(e);
          }}
          onKeyDown={(e) => e.stopPropagation()}
          disabled={disabled}
        >
          ×
        </button>
      )}
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        id={id}
        href={href}
        prefetch={prefetch}
        aria-label={ariaLabel || label}
        className={baseClass}
        data-color={color}
        data-variant={variant}
        onClick={(e) => {
          if (onClick) onClick(e);
        }}
        onKeyDown={(e) => handleKey(e, onClick, onDelete, disabled)}
      >
        {inner}
      </Link>
    );
  }

  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      id={id}
      role={clickable && !href ? 'button' : undefined}
      tabIndex={clickable || onDelete ? 0 : undefined}
      aria-label={ariaLabel || (clickable ? label : undefined)}
      aria-disabled={disabled || undefined}
      className={baseClass}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => handleKey(e, onClick, onDelete, disabled)}
      data-color={color}
      data-variant={variant}
    >
      {inner}
    </span>
  );
});
