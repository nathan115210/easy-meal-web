import Skeleton from '@/components/skeleton/Skeleton';
import styles from './sideNavigation.module.scss';
import Image from 'next/image';

export default function SideNavigationSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <Image
        className={styles.logo}
        src="/logo.svg"
        alt="Your brand"
        width={120}
        height={70}
        priority
      />
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton.Pill key={i} width={120} height={28} />
      ))}
    </div>
  );
}
