import styles from './searchBar.module.scss';

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
  return (
    <form
      className={`${styles.searchBar} ${classname}`}
      method={'get'}
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
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete="off"
      />
    </form>
  );
}

export default SearchBar;
