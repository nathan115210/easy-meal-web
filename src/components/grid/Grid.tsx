import React, { forwardRef, HTMLAttributes } from 'react';
import clsx from 'clsx'; //

//
// Grid
//
interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  fluid?: boolean;
}

export const Grid = forwardRef<HTMLDivElement, ContainerProps>(
  ({ fluid = false, className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={clsx(fluid ? 'grid-fluid' : 'grid', className)} {...rest}>
        {children}
      </div>
    );
  }
);
Grid.displayName = 'Grid';

//
// Row
//

export const Row = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div ref={ref} className={clsx('row', className)} {...rest}>
        {children}
      </div>
    );
  }
);
Row.displayName = 'Row';

//
// Col
//
interface ColProps extends HTMLAttributes<HTMLDivElement> {
  sm: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export const Col = forwardRef<HTMLDivElement, ColProps>(
  ({ sm, md, lg, xl, className, children, ...rest }, ref) => {
    const classes = clsx(
      `col-sm-${sm}`,
      md && `col-md-${md}`,
      lg && `col-lg-${lg}`,
      xl && `col-xl-${xl}`,
      className
    );

    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  }
);
Col.displayName = 'Col';
