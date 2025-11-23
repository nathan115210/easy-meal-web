'use client';

import React, { memo } from 'react';
import styles from './smartSearchOptions.module.scss';
import ChipsGroup from '@/components/chip/ChipsGroup';
import Chip from '@/components/chip/Chip';

import type {
  ClearOptionFn,
  SmartSearchOptionsState,
  UpdateOptionFn,
} from '@/utils/hooks/useSmartSearchOptions';
import OptionInput from '@/components/smartSearchOptions/OptionInput';
import FieldLabelRow from '@/components/smartSearchOptions/FieldLabelRow';

export type SmartSearchFilterKey = keyof SmartSearchOptionsState;

export type SmartSearchOptionItem = {
  label: string;
  value: string;
};

type FilterBaseConfig = {
  key: SmartSearchFilterKey;
  label: string;
};

type InputFilterConfig = FilterBaseConfig & {
  type: 'input';
  placeholder: string;
  ariaLabel: string;
  clearable?: boolean;
  isExclude?: boolean;
};

type SingleSelectFilterConfig = FilterBaseConfig & {
  type: 'single';
  ariaLabel: string;
  items: SmartSearchOptionItem[];
};

type MultiSelectFilterConfig = FilterBaseConfig & {
  type: 'multiple';
  ariaLabel: string;
  items: SmartSearchOptionItem[];
  clearable?: boolean;
};

export type SmartFilterConfigType =
  | InputFilterConfig
  | SingleSelectFilterConfig
  | MultiSelectFilterConfig;

type Props = {
  config: SmartFilterConfigType;
  value: SmartSearchOptionsState[SmartSearchFilterKey];
  updateOption: UpdateOptionFn;
  clearOption: ClearOptionFn;
};

function SmartFilterSectionComponent({ config, value, updateOption, clearOption }: Props) {
  if (config.type === 'input') {
    const arrValue = value as string[];
    return (
      <div className={styles.optionContainer}>
        <FieldLabelRow
          label={config.label}
          showClear={config.clearable && arrValue.length > 0}
          onClear={config.clearable ? () => clearOption(config.key) : undefined}
        />
        <OptionInput
          inputId={`${config.key}-input`}
          ariaLabel={config.ariaLabel}
          placeholder={config.placeholder}
          values={arrValue}
          isExclude={config.isExclude}
          onChange={(vals) => updateOption(config.key, vals)}
        />
      </div>
    );
  }

  if (config.type === 'single') {
    const singleValue = value as string;

    return (
      <div className={styles.optionContainer}>
        <FieldLabelRow label={config.label} />
        <ChipsGroup selectionMode="single" ariaLabel={config.ariaLabel}>
          {config.items.map((item) => (
            <Chip
              key={item.value}
              type="single-select"
              label={item.label}
              selected={singleValue === item.value}
              onSelect={() => updateOption(config.key, item.value)}
            />
          ))}
        </ChipsGroup>
      </div>
    );
  }

  if (config.type === 'multiple') {
    const arrValue = value as string[];

    return (
      <div className={styles.optionContainer}>
        <FieldLabelRow
          label={config.label}
          showClear={config.clearable && arrValue.length > 0}
          onClear={config.clearable ? () => clearOption(config.key) : undefined}
        />
        <ChipsGroup selectionMode="multiple" ariaLabel={config.ariaLabel}>
          {config.items.map((item) => (
            <Chip
              key={item.value}
              type="multi-select"
              label={item.label}
              selected={arrValue.includes(item.value)}
              onSelect={(selected) =>
                updateOption(
                  config.key,
                  selected ? [...arrValue, item.value] : arrValue.filter((v) => v !== item.value)
                )
              }
            />
          ))}
        </ChipsGroup>
      </div>
    );
  }

  return null;
}

const SmartFilterSection = memo(SmartFilterSectionComponent);
SmartFilterSection.displayName = 'SmartFilterSection';

export default SmartFilterSection;
