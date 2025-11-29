'use client';

import styles from './searchBar.module.scss';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type SearchBarProps = {
  ariaLabel: string;
  inputId: string;
  inputName?: string;
  defaultValue?: string;
  classname?: string;
  placeholder?: string;
};

function SearchBar({
  inputId,
  inputName = 'search',
  defaultValue = '', //TODO: considering to add the ability to set default value from props, and let default value has light grey color. just like BiliBili
  ariaLabel,
  classname = '',
  placeholder = 'Search...',
}: SearchBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [value, setValue] = useState<string>(
    defaultValue !== '' ? defaultValue : (searchParams?.get(inputName) ?? '')
  );

  useEffect(() => {
    const param = searchParams?.get(inputName) ?? defaultValue;

    // Only update if it actually changed
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue((prev) => (prev === param ? prev : param));
  }, [searchParams, inputName, defaultValue]);

  const action = getComputedSearchAction(pathname);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (inputValue === '') {
      router.push(action);
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

function getComputedSearchAction(pagePath: string): string {
  const defaultAction = '/meals';

  if (!pagePath) return defaultAction;

  const raw = pagePath.split(/[?#]/)[0] || '';
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  if (path === '/' || path === '') return defaultAction;

  const p = path.toLowerCase();

  const routes: Array<[RegExp, string]> = [
    [/^\/meals(?:\/|$)/, '/meals'],
    // TODO: add more mappings as you add pages
    [/^\/restaurants(?:\/|$)/, '/restaurants'],
    [/^\/products?(?:\/|$)/, '/products'],
    [/^\/search(?:\/|$)/, '/search'],
    [/^\/posts(?:\/|$)/, '/posts'],
    [/^\/blog(?:\/|$)/, '/blog'],
    [/^\/admin(?:\/|$)/, '/admin'],
    [/^\/dashboard(?:\/|$)/, '/dashboard'],
    [/^\/auth(?:\/|$)/, '/auth'],
    [/^\/account(?:\/|$)/, '/account'],
    [/^\/orders(?:\/|$)/, '/orders'],
    [/^\/users(?:\/|$)/, '/users'],
  ];

  for (const [re, action] of routes) {
    if (re.test(p)) return action;
  }

  const m = p.match(/^\/([^/]+)/);
  if (m) return `/${m[1]}`;

  return defaultAction;
}
