import Skeleton from '@/components/Skeleton/Skeleton';
import styles from './loadingFooter.module.scss';

export default function LoadingFooter() {
  return (
    <footer className={styles['loading-footer']}>
      <div className={styles['loading-footer-inner']}>
        {/* Brand & social */}
        <div className={styles['loading-footer-brand']}>
          <Skeleton variant="block" size="md" className={styles['loading-footer-logo']} />
          <div className={styles['loading-footer-social']}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="circle" size="sm" />
            ))}
          </div>
        </div>

        {/* Footer links columns */}
        <div className={styles['loading-footer-links']}>
          {Array.from({ length: 3 }).map((_, col) => (
            <div key={col} className={styles['loading-footer-col']}>
              <Skeleton variant="text" size="sm" />
              <Skeleton variant="text" size="sm" />
              <Skeleton variant="text" size="sm" />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}