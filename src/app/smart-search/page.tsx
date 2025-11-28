import styles from './page.module.scss';
import SmartSearchPanel from '@/app/smart-search/components/smartSearchPanel/SmartSearchPanel';
import { Grid, Row } from '@/components/grid/Grid';
import MealsInfiniteList from '@/components/infiniteList/MealsInfiniteList';
import { CookTimeValue } from '@/utils/types/meals';

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
      <div className={styles.searchResults}>
        <Grid className={styles.mealsList}>
          <Row>
            <MealsInfiniteList cookTime={CookTimeValue.Any} />
          </Row>
        </Grid>
      </div>
    </div>
  );
}

export default SmartSearchPage;
