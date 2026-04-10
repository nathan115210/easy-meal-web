import Image from 'next/image';
import styles from './loading.module.scss';

const MESSAGES = [
  'Preparing your kitchen workspace...',
  'Gathering seasonal inspiration...',
  'Refining your weekly outlook...',
  'Curating intentional recipes...',
  'Setting the table for discovery...',
];

export default function Loading() {
  return (
    <div className={styles.root}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <div className={styles.ringPulse} aria-hidden="true" />

          <div className={styles.logoBox}>
            <div className={styles.shimmer} aria-hidden="true" />
            <Image
              src="/logo.svg"
              alt="Easy Meal"
              width={200}
              height={43}
              className={styles.icon}
              priority
            />
          </div>
        </div>

        <div className={styles.text}>
          <h2 className={styles.heading}>Easy Meal</h2>

          <div className={styles.messageSlot} aria-label="Loading">
            {MESSAGES.map((msg, i) => (
              <p
                key={`${msg}-${i}`}
                className={styles.message}
                style={{ animationDelay: `${i * 2.5}s` }}
                aria-hidden={i !== 0}
              >
                {msg}
              </p>
            ))}
          </div>
        </div>

        <div className={styles.progressTrack} role="progressbar" aria-label="Loading">
          <div className={styles.progressBar} />
        </div>
      </div>
    </div>
  );
}
