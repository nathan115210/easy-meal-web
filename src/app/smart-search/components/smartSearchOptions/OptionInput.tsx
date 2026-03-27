'use client';

import { useState } from 'react';
import ChipsGroup from '@/components/chip/ChipsGroup';
import Chip from '@/components/chip/Chip';
import styles from './smartSearchOptions.module.scss';
import { titleCase } from '@/utils/lib/helpers';
import { OctagonX } from 'lucide-react';

export interface OptionInputProps {
  inputId: string;
  ariaLabel: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
  isExclude?: boolean;
}

function OptionInput({
  inputId,
  ariaLabel,
  placeholder,
  values,
  onChange,
  isExclude = false,
}: OptionInputProps) {
  const [inputValue, setInputValue] = useState('');

  const validInputValue = (): boolean => {
    const value = titleCase(inputValue);
    return value.length > 0 && !values.includes(value);
  };

  const addValue = () => {
    if (!validInputValue()) return;

    const newValue = titleCase(inputValue);

    const nextValues = [...values, newValue];
    onChange(nextValues);
    setInputValue('');
  };

  const removeValue = (valueToRemove: string) => {
    const nextValues = values.filter((v) => v !== valueToRemove);
    onChange(nextValues);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addValue();
    }
  };

  return (
    <>
      <label className="assistiveText" htmlFor={inputId}>
        {ariaLabel}
      </label>

      <div className={styles.inlineInputRow}>
        <input
          className={styles.optionInput}
          type="text"
          id={inputId}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          className={styles.addInlineBtn}
          onClick={addValue}
          disabled={!validInputValue()}
          aria-disabled={!validInputValue()}
        >
          Add
        </button>
      </div>

      {values.length > 0 && (
        <ChipsGroup>
          {values.map((item) => (
            <Chip
              type="button"
              variant={isExclude ? 'destructive' : 'primary'}
              deletable
              key={item}
              label={<ValueLabel value={item} isExclude={isExclude} />}
              onDelete={() => removeValue(item)} // <— remove handler
            />
          ))}
        </ChipsGroup>
      )}
    </>
  );
}

export default OptionInput;

function ValueLabel({ value, isExclude }: { value: string; isExclude?: boolean }) {
  if (isExclude) {
    return (
      <div className={styles.excludeLabelRow}>
        <OctagonX size={18} /> {value}
      </div>
    );
  }
  return <div>{value}</div>;
}
