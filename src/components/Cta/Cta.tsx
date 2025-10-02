import React from 'react';
import Link from 'next/link';
import styles from './cta.module.scss';
import { CtaSizes, CtaType, CtaVariants } from '@/components/Cta/ctaType';
import { LinkIcon } from '@/components/Svg/Svg';

export interface CtaProps {
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  disabled?: boolean;
  type?: CtaType;
  variant?: CtaVariants;
  size?: CtaSizes;
  className?: string;
  hasIcon?: boolean;
}

export default function Cta({
  children,
  href,
  onClick,
  disabled = false,
  type = CtaType.Button,
  variant = CtaVariants.Primary,
  size = CtaSizes.Medium,
  hasIcon = true,
  className = '',
  ...rest
}: CtaProps) {
  const classes = [
    styles.cta,
    styles[`cta--${variant}`],
    styles[`cta--${size}`],
    disabled ? styles['cta--disabled'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!href) {
    return (
      <button
        type={type}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        disabled={disabled}
        className={classes}
        {...rest}
      >
        {children}
      </button>
    );
  }

  const isInternal = href.startsWith('/');

  return (
    <Link
      href={href}
      passHref={isInternal ? true : undefined}
      target={!isInternal ? '_blank' : undefined}
      rel={!isInternal ? 'noopener noreferrer' : undefined}
      onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
      className={classes}
      {...rest}
    >
      {children}
      {!!hasIcon && <LinkIcon />}
    </Link>
  );
}
