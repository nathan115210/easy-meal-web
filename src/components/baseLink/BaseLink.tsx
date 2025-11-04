'use client';

import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { forwardRef, memo } from 'react';
import buttonStyles from '../button/button.module.scss';
import linkStyles from './baseLink.module.scss';
import type { ButtonVariant } from '../button/Button';

type LinkVariant = 'link' | 'link-muted';
type Underline = 'always' | 'hover' | 'none';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant | LinkVariant; // 'link*' -> text link, others -> button look
  underline?: Underline; // only affects text-link appearance
  className?: string;
  loading?: boolean;
  loadingText?: string;
  pressed?: boolean; // optional toggle state
  iconOnly?: boolean; // requires aria-label when true
  disabled?: boolean; // blocks nav + interaction
};

const buttonVariantSet = new Set<ButtonVariant>([
  'primary',
  'secondary',
  'primary-outline',
  'secondary-outline',
]);

const BaseLink = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    variant = 'link',
    underline = 'hover',
    className,
    loading = false,
    loadingText = 'Loading…',
    pressed,
    iconOnly = false,
    disabled = false,
    target,
    rel,
    href,
    onClick,
    children,
    ...rest
  },
  ref
) {
  const isLoading = Boolean(loading);
  const isDisabled = Boolean(disabled);
  const isButtonLike = buttonVariantSet.has(variant as ButtonVariant);

  // Dev-only guard for icon-only
  if (process.env.NODE_ENV !== 'production') {
    const ariaLabel = (rest as Record<string, unknown>)['aria-label'];
    if (iconOnly && (typeof ariaLabel !== 'string' || ariaLabel.trim().length === 0)) {
      console.warn('Link: `iconOnly` requires an accessible label via `aria-label`.');
    }
  }

  const cls = [
    isButtonLike ? buttonStyles.button : linkStyles.link,
    isButtonLike
      ? (buttonStyles[`button--${variant}`] ?? buttonStyles['button--primary'])
      : (linkStyles[`link--${variant}`] ?? linkStyles['link--link']),
    !isButtonLike ? linkStyles[`link--underline-${underline}`] : '',
    iconOnly && isButtonLike ? buttonStyles['button--icon-only'] : '',
    isLoading ? (isButtonLike ? buttonStyles['is-loading'] : linkStyles['is-loading']) : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled || isLoading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };
  const safeRel =
    target === '_blank' ? [rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ') : rel;

  const hrefAttr = isDisabled || isLoading ? undefined : href;
  const tabIndex = isDisabled || isLoading ? -1 : rest.tabIndex;

  // determine role and aria-pressed only when appropriate (avoid aria-pressed on implicit link role)
  const restRole = (rest as Record<string, unknown>).role as string | undefined;
  const roleAttr = restRole ?? (pressed !== undefined ? 'button' : undefined);
  const ariaPressed = roleAttr === 'button' ? pressed : undefined;

  const spinnerClass = isButtonLike ? buttonStyles.spinner : linkStyles.spinner;
  const srOnlyClass = isButtonLike ? buttonStyles['sr-only'] : linkStyles['sr-only'];

  return (
    <a
      ref={ref}
      className={cls}
      href={hrefAttr}
      target={target}
      rel={safeRel}
      aria-disabled={isDisabled || undefined}
      aria-busy={isLoading || undefined}
      onClick={handleClick}
      tabIndex={tabIndex as number | undefined}
      {...rest}
      role={roleAttr}
      aria-pressed={ariaPressed}
    >
      {isLoading && <span className={spinnerClass} aria-hidden="true" />}
      {!(isLoading && iconOnly) && <span aria-hidden={isLoading || undefined}>{children}</span>}
      {isLoading && (
        <span className={srOnlyClass} role="status" aria-live="polite">
          {loadingText}
        </span>
      )}
    </a>
  );
});

export default memo(BaseLink);
