'use client';

import { useSmartSearchOptions } from '@/utils/hooks/useSmartSearchOptions';

import SmartSearchOptions from '@/components/smartSearchOptions/SmartSearchOptions';
import { SMART_SEARCH_FILTER_CONFIG } from '@/utils/constants/smartSearch/filtersConfig';

export default function SmartSearchOptionsContainer() {
  const { options, updateOption, clearOption, resetAll } = useSmartSearchOptions({
    storageKey: 'easy-meal:smart-search',
  });

  const handleSearch = () => {
    console.log('Search with options:', options);
    // TODO: call API or navigate with URL params
  };

  return (
    <SmartSearchOptions
      options={options}
      updateOption={updateOption}
      clearOption={clearOption}
      filterConfig={SMART_SEARCH_FILTER_CONFIG}
      onSearch={handleSearch}
      onReset={resetAll}
    />
  );
}
