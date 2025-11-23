import styles from './page.module.scss';
import SmartSearchPanel from '@/app/smart-search/components/smartSearchPanel/SmartSearchPanel';

function SmartSearchPage() {
  //1. initial recipes list should be the "most trending" recipes / popular recipes
  // 2. if user enters a search term, filter the recipes list based on the search term
  // 3. if user applies filters (e.g., dietary preferences, cooking time), update the recipes list
  // 4. display the filtered recipes list to the user

  return (
    <div className={styles.smartSearch}>
      <div className={styles.searchPanel}>
        <SmartSearchPanel />
      </div>
      <div className={styles.searchResults}>searchResults panel</div>
    </div>
  );
}

export default SmartSearchPage;
