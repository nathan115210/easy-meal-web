import styles from './page.module.scss';
import TopBar from '@/components/topBar/TopBar';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <TopBar />
    </div>
  );
}
