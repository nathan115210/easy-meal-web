import Skeleton from '@/components/skeleton/Skeleton';
import styles from './bottomNavigation.module.scss';

export default function BottomNavigationSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton.Pill key={i} width={120} height={28} />
      ))}
    </div>
  );
}
