'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './smartSearchPanel.module.scss';
import SmartSearchOptions from '@/app/smart-search/components/smartSearchOptions/SmartSearchOptions';
import { SMART_SEARCH_FILTER_CONFIG } from '@/utils/constants/smartSearch/filtersConfig';
import { useSmartSearchNavigation } from '@/utils/hooks/useSmartSearchNavigation';
import useSmartSearchOptions, { DEFAULT_SMART_OPTIONS } from '@/utils/hooks/useSmartSearchOptions';
import Button from '@/components/button/Button';
import ButtonGroup from '@/components/buttonGroup/ButtonGroup';
import { ChevronUp, ChevronDown } from 'lucide-react';
import useMediaQuery from '@/utils/hooks/useMediaQuery';
import { deviceMediaQueries } from '@/utils/constants/mediaQuery';

function SmartSearchPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobile = useMediaQuery(deviceMediaQueries.mobile);

  const { options, updateOption, clearOption, resetAll } = useSmartSearchOptions();
  const { handleSearch } = useSmartSearchNavigation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasSearchParam = searchParams.size > 0;

  const isDefaultOptions = useMemo(() => {
    try {
      return JSON.stringify(options) === JSON.stringify(DEFAULT_SMART_OPTIONS);
    } catch {
      return false;
    }
  }, [options]);

  const handleSearchClick = () => {
    handleSearch(options);
    setIsExpanded(false);
  };

  const handleReset = () => {
    resetAll();
    const currentQuery = searchParams?.toString() ?? '';
    const currentUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname;
    if (currentUrl !== pathname) {
      router.push(pathname, { scroll: false });
    }
  };

  return (
    <div className={styles.smartSearchPanel} data-panel-expanded={String(isExpanded)}>
      <div className={styles.panelBody}>
        <div className={styles.panelHeader}>
          <h2>Search Criteria</h2>
        </div>
        <SmartSearchOptions
          options={options}
          updateOption={updateOption}
          clearOption={clearOption}
          filterConfig={SMART_SEARCH_FILTER_CONFIG}
        />
      </div>

      <div className={styles.panelFooter}>
        <ButtonGroup align={isExpanded ? 'between' : 'center'}>
          {isExpanded && (
            <Button
              variant="primary"
              onClick={handleSearchClick}
              disabled={!hasSearchParam && isDefaultOptions}
            >
              Search
            </Button>
          )}
          {/* TODO: should be more communicated with users, by adding more descriptive label in the toggle button */}
          {isMobile && (
            <Button
              className="toggleCta"
              variant="ghost"
              iconOnly
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse search filters' : 'Expand search filters'}
            >
              {isExpanded ? (
                <ChevronUp size={24} aria-hidden="true" />
              ) : (
                <ChevronDown size={24} aria-hidden="true" />
              )}
            </Button>
          )}

          {isExpanded && (
            <Button
              variant="secondary-outline"
              onClick={handleReset}
              disabled={!hasSearchParam && isDefaultOptions}
            >
              Reset
            </Button>
          )}
        </ButtonGroup>
      </div>
    </div>
  );
}

export default SmartSearchPanel;
