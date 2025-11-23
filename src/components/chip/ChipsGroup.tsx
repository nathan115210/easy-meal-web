import styles from './chip.module.scss';
import { ReactNode } from 'react';

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface ChipsGroupProps {
  children: ReactNode;
  className?: string;
  /**
   * Selection mode for accessibility:
   * - 'single'   -> radiogroup (use with type="single-select" chips)
   * - 'multiple' -> group (use with type="multi-select" chips)
   * - 'none'     -> purely visual group
   */
  selectionMode?: 'none' | 'single' | 'multiple';
  ariaLabel?: string;
  ariaLabelledby?: string;
}

export default function ChipsGroup({
  children,
  className,
  selectionMode = 'none',
  ariaLabel,
  ariaLabelledby,
}: Readonly<ChipsGroupProps>) {
  const role =
    selectionMode === 'single' ? 'radiogroup' : selectionMode === 'multiple' ? 'group' : undefined;

  return (
    <div
      className={cx(styles.chipsGroup, className)}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      {children}
    </div>
  );
}
