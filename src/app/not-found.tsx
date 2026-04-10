import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';
import styles from './not-found.module.scss';

export default function RootNotFoundPage() {
  return (
    <div className={styles.root}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.content}>
        {/* Icon badge */}
        <div className={styles.badgeWrapper}>
          <div className={styles.ringPulse} aria-hidden="true" />

          <div className={styles.badgeBox}>
            <div className={styles.shimmerFrame} aria-hidden="true">
              <div className={styles.shimmer} />
            </div>

            <Image
              src="/logo.svg"
              alt="Easy Meal"
              width={200}
              height={43}
              className={styles.badgeIcon}
              priority
            />
          </div>
        </div>

        {/* Heading and description */}
        <div className={styles.text}>
          <h1 className={styles.heading}>Not Found</h1>
          <p className={styles.description}>
            The path you followed seems to have strayed from the kitchen. Allow us to help you find
            your way back.
          </p>
        </div>

        {/* Navigation actions */}
        <nav className={styles.actions} aria-label="Recovery navigation">
          <Link href="/" className={styles.primaryAction}>
            <ArrowLeft
              size={16}
              strokeWidth={1.75}
              className={styles.primaryActionIcon}
              aria-hidden="true"
            />
            Return Home
          </Link>

          <Link href="/meals" className={styles.secondaryAction}>
            <Sparkles
              size={16}
              strokeWidth={1.5}
              className={styles.secondaryActionIcon}
              aria-hidden="true"
            />
            Start New Discovery
          </Link>
        </nav>

        {/* Footer label */}
        <div className={styles.footer}>
          <p className={styles.footerLabel}>Easy Meal Project &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}
