import type { Metadata } from 'next';
import styles from './meals.module.scss';

export const metadata: Metadata = {
  title: 'Easy meal - all meals',
};

export default function MealsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles['meals-layout']}>
      {children}
    </div>
  );
}
