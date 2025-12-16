import styles from './spinner.module.scss';
import React from 'react';

function Spinner({ loadingLabel, ...rest }: { loadingLabel?: string }) {
  return (
    <div className={styles.loader} role="status" aria-live="polite" {...rest}>
      <span className={styles.spinner} aria-hidden />
      {loadingLabel && <span className={styles.loadingLabel}>{loadingLabel}</span>}
    </div>
  );
}

export default Spinner;
