import styles from './topBar.module.scss';
import SearchBar from '@/components/searchBar/SearchBar';
import Image from 'next/image';
import Link from 'next/link';
import LiveTipsNotificationBar from '@/components/notification/LiveTipsNotificationBar';
function TopBar({
  inputId = 'search-recipes',
  ariaLabel = 'topbar-search-recipes',
  placeholder = 'Search recipes, ingredients, or diets…',
  showSearch = true,
}: {
  inputId?: string;
  ariaLabel?: string;
  placeholder?: string;
  showSearch?: boolean;
}) {
  return (
    <div className={styles.topBarContainer}>
      <div className={styles.topBar} data-testid="topbar">
        <Link href={'/'} className={styles.logo}>
          <Image src="/logo.svg" alt="Your brand" width={120} height={27} priority />
        </Link>
        {showSearch && (
          <SearchBar
            classname={styles.searchBar}
            inputId={inputId}
            ariaLabel={ariaLabel}
            placeholder={placeholder}
          />
        )}
        <div className={styles.userBtn}></div>
      </div>
      <LiveTipsNotificationBar />
    </div>
  );
}

export default TopBar;
