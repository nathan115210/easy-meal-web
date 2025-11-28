'use client';

import { AnchorHTMLAttributes, forwardRef, MouseEvent, useState } from 'react';
import buttonStyles from '../button/button.module.scss';
import linkStyles from './baseLink.module.scss';
import type { ButtonVariant } from '../button/Button';
import Link from 'next/link';

type LinkVariant = 'link' | 'link-muted';
type Underline = 'always' | 'hover' | 'none';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant | LinkVariant; // 'link*' -> text link, others -> button look
  underline?: Underline; // only affects text-link appearance
  className?: string;
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

const BaseLink = forwardRef<HTMLAnchorElement, LinkProps>(function LinkComponent(
  {
    variant = 'link',
    underline = 'hover',
    className,
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
  const isDisabled = Boolean(disabled);
  const isButtonLike = buttonVariantSet.has(variant as ButtonVariant);
  const [active, setActive] = useState(false);

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
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  const handleMouseEnter = () => {
    setActive(true);
  };
  const safeRel =
    target === '_blank' ? [rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ') : rel;

  const tabIndex = isDisabled ? -1 : rest.tabIndex;

  // determine role and aria-pressed only when appropriate (avoid aria-pressed on implicit link role)
  const restRole = (rest as Record<string, unknown>).role as string | undefined;
  const roleAttr = restRole ?? (pressed !== undefined ? 'button' : undefined);
  const ariaPressed = roleAttr === 'button' ? pressed : undefined;

  return (
    <Link
      ref={ref}
      className={cls}
      href={href}
      target={target}
      rel={safeRel}
      aria-disabled={isDisabled || undefined}
      onClick={handleClick}
      tabIndex={tabIndex as number | undefined}
      {...rest}
      role={roleAttr}
      aria-pressed={ariaPressed}
      prefetch={active ? null : false}
      onMouseEnter={handleMouseEnter}
    >
      {!iconOnly && <span className={linkStyles['link-span']}>{children}</span>}
    </Link>
  );
});

export default BaseLink;
