'use client';
import React, { forwardRef } from 'react';
import styles from './chip.module.scss';
import { X } from 'lucide-react';

export type ChipType = 'label' | 'button' | 'single-select' | 'multi-select';
export type ChipVariant =
  | 'muted'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'accent';

export interface ChipProps {
  label: React.ReactNode;
  type?: ChipType;
  variant?: ChipVariant;
  selected?: boolean;
  disabled?: boolean;
  deletable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onSelect?: (selected: boolean, event: React.MouseEvent | React.KeyboardEvent) => void;
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  labelIcon?: React.JSX.Element;
}

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const Chip = forwardRef<HTMLDivElement | HTMLSpanElement, ChipProps>(
  (
    {
      label,
      type = 'button',
      variant = 'muted',
      selected = false,
      disabled = false,
      deletable = false,
      size = 'md',
      className,
      onSelect,
      onDelete,
      labelIcon,
    },
    ref
  ) => {
    const isLabelType = type === 'label';
    const variantKey = `variant${capitalize(variant)}` as keyof typeof styles;
    const variantClass = styles[variantKey] ?? styles.variantMuted;

    const commonClass = cx(
      styles.chip,
      variantClass,
      selected && styles.selected,
      size === 'sm' && styles.sm,
      size === 'lg' && styles.lg,
      disabled && styles.disabled,
      isLabelType && styles.labelType,
      type === 'single-select' && styles.singleSelect,
      type === 'multi-select' && styles.multiSelect,
      className
    );

    if (isLabelType) {
      return (
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          className={commonClass}
          aria-disabled={disabled || undefined}
        >
          {labelIcon && labelIcon}
          <span className={styles.label}>{label}</span>
        </span>
      );
    }

    const handleActivate = (e: React.MouseEvent | React.KeyboardEvent) => {
      if (disabled) return;
      onSelect?.(!selected, e);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleActivate(e);
      }
    };
    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onDelete?.(e);
    };

    let role: 'button' | 'checkbox' | 'radio' | undefined;
    let ariaPressed: boolean | undefined;
    let ariaChecked: boolean | undefined;
    if (type === 'button') {
      role = 'button';
      ariaPressed = onSelect ? selected : undefined;
    } else if (type === 'single-select') {
      role = 'radio';
      ariaChecked = selected;
    } else if (type === 'multi-select') {
      role = 'checkbox';
      ariaChecked = selected;
    }
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={commonClass}
        role={role}
        tabIndex={disabled ? -1 : 0}
        aria-pressed={ariaPressed}
        aria-checked={ariaChecked}
        aria-disabled={disabled || undefined}
        onClick={handleActivate}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.label}>{label}</span>

        {deletable && onDelete && (
          <button
            type="button"
            aria-label="Remove"
            className={styles.deleteBtn}
            onClick={handleDelete}
            disabled={disabled}
          >
            <X size={16} />
          </button>
        )}
        {type === 'multi-select' && selected && <X size={16} />}
      </div>
    );
  }
);

Chip.displayName = 'Chip';
export default Chip;
