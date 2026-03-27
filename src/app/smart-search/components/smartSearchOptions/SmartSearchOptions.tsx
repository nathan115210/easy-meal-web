'use client';

import { useMemo } from 'react';
import styles from './smartSearchOptions.module.scss';
import SmartFilterSection, {
  SmartFilterConfigType,
  SmartSearchFilterKey,
} from './SmartFilterSection';
import { ClearOptionFn, UpdateOptionFn } from '@/utils/hooks/useSmartSearchOptions';
import { SmartSearchOptionsState } from '@/utils/types/meals';

export type SmartSearchOptionsProps = {
  options: SmartSearchOptionsState;
  updateOption: UpdateOptionFn;
  clearOption: ClearOptionFn;
  filterConfig: SmartFilterConfigType[];
};

function SmartSearchOptions({
  options,
  updateOption,
  clearOption,
  filterConfig,
}: SmartSearchOptionsProps) {
  const sortedConfig = useMemo(() => {
    return [...filterConfig].sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;

      return orderA - orderB;
    });
  }, [filterConfig]);

  return (
    <div className={styles.smartSearchOptions}>
      {sortedConfig.map((config, index) => (
        <SmartFilterSection
          key={`smart-filter-section-${index}`}
          config={config}
          value={options[config.key as SmartSearchFilterKey]}
          updateOption={updateOption}
          clearOption={clearOption}
        />
      ))}
    </div>
  );
}

export default SmartSearchOptions;
