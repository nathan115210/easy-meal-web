import styles from './topBar.module.scss';
import SearchBar from '@/components/searchBar/SearchBar';
import Image from 'next/image';
import Link from 'next/link';

function TopBar() {
  return (
    <div className={styles.topBar}>
      <Link href={'/'} className={styles.logo}>
        <Image src="/logo.svg" alt="Your brand" width={120} height={27} priority />
      </Link>
      <SearchBar
        classname={styles.searchBar}
        action={'/meals'}
        inputId={'search-recipes'}
        ariaLabel={'topbar-search-recipes'}
        placeholder={'Search recipes, ingredients, or diets…'}
      />
      <div className={styles.userBtn}></div>
    </div>
  );
}

export default TopBar;
