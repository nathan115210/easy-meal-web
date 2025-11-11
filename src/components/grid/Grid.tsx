import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface ContainerProps {
  fluid?: boolean;
  className?: string;
  children: ReactNode;
}

export const Grid: React.FC<ContainerProps> = ({ fluid = false, className, children }) => {
  return <div className={clsx(fluid ? 'grid-fuild' : 'grid', className)}>{children}</div>;
};

interface RowProps {
  className?: string;
  children: ReactNode;
}

export const Row: React.FC<RowProps> = ({ className, children }) => {
  return <div className={clsx('row', className)}>{children}</div>;
};

interface ColProps {
  sm: number;
  md?: number;
  lg?: number;
  xl?: number;
  className?: string;
  children: ReactNode;
}

export const Col: React.FC<ColProps> = ({ sm, md, lg, xl, className, children }) => {
  const classes = clsx(
    `col-sm-${sm}`,
    md && `col-md-${md}`,
    lg && `col-lg-${lg}`,
    xl && `col-xl-${xl}`,
    className
  );
  return <div className={classes}>{children}</div>;
};
