'use client';

import styles from './searchBar.module.scss';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export type SearchBarProps = {
  action: string;
  ariaLabel: string;
  inputId: string;
  inputName?: string;
  defaultValue?: string;
  classname?: string;
  placeholder?: string;
};

function SearchBar({
  action,
  inputId,
  inputName = 'q',
  defaultValue = '',
  ariaLabel,
  classname = '',
  placeholder = 'Search...',
}: SearchBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState<string>(
    defaultValue !== '' ? defaultValue : (searchParams?.get(inputName) ?? '')
  );
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    if (inputValue === '') {
      router.push('/meals');
    }
  };
  return (
    <form
      className={`${styles.searchBar} ${classname}`}
      method="get"
      action={action}
      role="search"
      aria-label={ariaLabel}
    >
      <label className="assistiveText" htmlFor={inputId}>
        {ariaLabel}
      </label>
      <input
        className={styles.searchInput}
        id={inputId}
        type="search"
        name={inputName}
        value={value}
        onChange={handleOnChange}
        placeholder={placeholder}
        autoComplete="off"
      />
    </form>
  );
}

export default SearchBar;
