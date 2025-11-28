import React from 'react';
import styles from './bottomLine.module.scss';
import BaseLink from '@/components/baseLink/BaseLink';
import ButtonGroup from '@/components/buttonGroup/ButtonGroup';

export default function BottomLine({
  label = ' 🙌 You’ve reached the end',
  clearHref,
  showClear = false,
}: {
  label?: string;
  clearHref?: string;
  showClear?: boolean;
}) {
  return (
    <div className={styles.bottomLine} role="status" aria-live="polite" aria-atomic="true">
      <div className={styles.bottomLineContent}>
        {label}
        {showClear && clearHref && (
          <ButtonGroup align={'center'}>
            <BaseLink href={clearHref} variant={'secondary-outline'}>
              Clear search
            </BaseLink>
          </ButtonGroup>
        )}
      </div>
    </div>
  );
}
