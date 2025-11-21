import React from 'react';
import styles from './bottomLine.module.scss';

export default function BottomLine({ label = ' 🙌 You’ve reached the end' }: { label?: string }) {
  return (
    <p className={styles.bottomLine} role="status" aria-live="polite" aria-atomic="true">
      {label}
    </p>
  );
}
