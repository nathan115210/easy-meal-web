import type { HTMLAttributes, ReactNode } from 'react';
import styles from './buttonGroup.module.scss';

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  align?: 'start' | 'center' | 'end' | 'between';

  ariaLabel?: string;
  ariaLabelledBy?: string;
};

function ButtonGroup({
  children,
  className,
  orientation = 'horizontal',
  align = 'start',

  ariaLabel,
  ariaLabelledBy,
  ...rest
}: ButtonGroupProps) {
  const cls = [
    styles.buttonGroup,
    orientation === 'vertical' ? styles.vertical : '',
    align === 'center' ? styles.alignCenter : '',
    align === 'end' ? styles.alignEnd : '',
    align === 'between' ? styles.alignBetween : styles.alignStart,

    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      role="group"
      className={cls}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      {...rest}
    >
      {children}
    </div>
  );
}

export default ButtonGroup;
