import Link from 'next/link'
import Image from 'next/image'
import React from 'react';
import './MainHeader.scss';

export default function MainHeader() {
    return (
        <header className="main-header">
            <Link href={'/'} className="main-header__logo">
                <Image src="/logo.svg" alt="Easy meal" width={150} height={150} priority/>
            </Link>
            <nav className="main-header__nav">
                <Link href="/" className="main-header__link">Home</Link>
                <Link href="/meals" className="main-header__link">Meals</Link>
                <Link href="/community" className="main-header__link">Community</Link>
            </nav>
        </header>
    )
}