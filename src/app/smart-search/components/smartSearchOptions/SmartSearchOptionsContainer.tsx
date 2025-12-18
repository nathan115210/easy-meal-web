'use client';

import SmartSearchOptions from '@/components/smartSearchOptions/SmartSearchOptions';
import { SMART_SEARCH_FILTER_CONFIG } from '@/utils/constants/smartSearch/filtersConfig';
import { useSmartSearchNavigation } from '@/utils/hooks/useSmartSearchNavigation';
import useSmartSearchOptions from '@/utils/hooks/useSmartSearchOptions';

export default function SmartSearchOptionsContainer() {
  const { options, updateOption, clearOption, resetAll } = useSmartSearchOptions();
  const { handleSearch } = useSmartSearchNavigation();

  return (
    <SmartSearchOptions
      options={options}
      updateOption={updateOption}
      clearOption={clearOption}
      filterConfig={SMART_SEARCH_FILTER_CONFIG}
      onSearch={handleSearch}
      onResetSearchOptions={resetAll}
    />
  );
}
