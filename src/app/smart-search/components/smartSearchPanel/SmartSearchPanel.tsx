import styles from './smartSearchPanel.module.scss';
import SmartSearchOptionsContainer from '@/app/smart-search/components/smartSearchOptions/SmartSearchOptionsContainer';

function SmartSearchPanel() {
  return (
    <div className={styles.smartSearchPanel}>
      <div>
        <h2 className={styles.heading}>Search Criteria</h2>
        <p className={styles.desc}>Describe what you are craving or tap options below.</p>
      </div>
      <SmartSearchOptionsContainer />
    </div>
  );
}

export default SmartSearchPanel;
