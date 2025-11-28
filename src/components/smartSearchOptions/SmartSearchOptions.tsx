'use client';

import React, { useMemo } from 'react';
import styles from './smartSearchOptions.module.scss';
import Button from '@/components/button/Button';
import ButtonGroup from '@/components/buttonGroup/ButtonGroup';
import SmartFilterSection, {
  SmartFilterConfigType,
  SmartSearchFilterKey,
} from './SmartFilterSection';
import {
  ClearOptionFn,
  DEFAULT_SMART_OPTIONS,
  UpdateOptionFn,
} from '@/utils/hooks/useSmartSearchOptions';
import { SmartSearchOptionsState } from '@/utils/types/meals';

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

  const sortedConfig = useMemo(() => {
    return [...filterConfig].sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;

      return orderA - orderB;
    });
  }, [filterConfig]);

  const isDefaultOptions = useMemo(() => {
    try {
      return JSON.stringify(options) === JSON.stringify(DEFAULT_SMART_OPTIONS);
    } catch {
      return false;
    }
  }, [options]);

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

      <ButtonGroup className={styles.actions} align="between">
        <Button
          className={styles.actionBtn}
          variant="primary"
          onClick={handleSearch}
          disabled={isDefaultOptions}
        >
          Search
        </Button>
        <Button
          className={styles.actionBtn}
          variant="secondary-outline"
          onClick={handleReset}
          disabled={isDefaultOptions}
        >
          Reset
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default SmartSearchOptions;
