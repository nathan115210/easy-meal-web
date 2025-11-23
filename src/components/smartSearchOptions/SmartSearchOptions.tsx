'use client';

import React from 'react';
import styles from './smartSearchOptions.module.scss';
import Button from '@/components/button/Button';
import ButtonGroup from '@/components/buttonGroup/ButtonGroup';
import SmartFilterSection, {
  SmartFilterConfigType,
  SmartSearchFilterKey,
} from './SmartFilterSection';
import type {
  ClearOptionFn,
  SmartSearchOptionsState,
  UpdateOptionFn,
} from '@/utils/hooks/useSmartSearchOptions';

export type SmartSearchOptionsProps = {
  options: SmartSearchOptionsState;
  updateOption: UpdateOptionFn;
  clearOption: ClearOptionFn;
  filterConfig: SmartFilterConfigType[];
  onSearch?: (options: SmartSearchOptionsState) => void;
  onReset?: () => void;
};

function SmartSearchOptions({
  options,
  updateOption,
  clearOption,
  filterConfig,
  onSearch,
  onReset,
}: SmartSearchOptionsProps) {
  const handleSearch = () => {
    onSearch?.(options);
  };

  const handleReset = () => {
    onReset?.();
  };

  return (
    <div className={styles.smartSearchOptions}>
      {filterConfig.map((config) => (
        <SmartFilterSection
          key={config.key}
          config={config}
          value={options[config.key as SmartSearchFilterKey]}
          updateOption={updateOption}
          clearOption={clearOption}
        />
      ))}

      <ButtonGroup className={styles.actions} align="between">
        <Button className={styles.actionBtn} variant="primary" onClick={handleSearch}>
          Search
        </Button>
        <Button className={styles.actionBtn} variant="secondary-outline" onClick={handleReset}>
          Reset
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default SmartSearchOptions;
