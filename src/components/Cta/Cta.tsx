import React, {FC} from 'react';
import Link from 'next/link';
import './Cta.scss';
import {CtaSizes, CtaType, CtaVariants} from "@/components/Cta/ctaType";


interface CtaProps {
    children: React.ReactNode;
    href?: string;
    /** Force full page reload even for internal links */
    external?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
    disabled?: boolean;
    type?: CtaType;
    variant?: CtaVariants;
    size?: CtaSizes;
    className?: string;
}

const LinkIcon: FC = () => {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="cta__external-icon"
        >
            <path
                d="M13 5l7 7-7 7M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default function Cta({
                                children,
                                href,
                                onClick,
                                disabled = false,
                                type = CtaType.Button,
                                variant = CtaVariants.Primary,
                                size = CtaSizes.Medium,
                                className = '',
                                ...rest
                            }: CtaProps) {
    const classes = [
        'cta',
        `cta--${variant}`,
        `cta--${size}`,
        disabled ? 'cta--disabled' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    // Button mode
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

    // Link mode
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
            <LinkIcon/>
        </Link>
    );
}
