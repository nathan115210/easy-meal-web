import React, { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import styles from './infoRow.module.scss';

/* =====================
   Context
===================== */

type InfoRowContextValue = { withinInfoRow: true };

const InfoRowContext = createContext<InfoRowContextValue | null>(null);

function useInfoRowContext(componentName: string) {
  const ctx = useContext(InfoRowContext);
  if (!ctx) {
    throw new Error(`${componentName} must be used within <InfoRow>.`);
  }
  return ctx;
}

/* =====================
   Root
===================== */

export interface InfoRowProps {
  children: React.ReactNode;
  className?: string;
}

function InfoRowRoot({ children, className }: InfoRowProps) {
  const value = useMemo<InfoRowContextValue>(() => ({ withinInfoRow: true }), []);

  return (
    <InfoRowContext.Provider value={value}>
      <div className={[styles.infoRowContainer, className].filter(Boolean).join(' ')}>
        {children}
      </div>
    </InfoRowContext.Provider>
  );
}

/* =====================
   Item
===================== */

export interface InfoRowItemProps extends PropsWithChildren {
  className?: string;
}

function InfoRowItem({ children, className }: InfoRowItemProps) {
  useInfoRowContext('InfoRow.Item');

  return <div className={[styles.infoItem, className].filter(Boolean).join(' ')}>{children}</div>;
}

/* =====================
   Icon
===================== */

type IconElementProps = {
  className?: string;
} & Record<string, unknown>;

export interface InfoRowIconProps {
  icon: React.ReactElement<IconElementProps>;
  className?: string;
}

function InfoRowIcon({ icon, className }: InfoRowIconProps) {
  useInfoRowContext('InfoRow.Icon');

  const mergedClassName = [styles.icon, icon.props.className, className].filter(Boolean).join(' ');

  return React.cloneElement(icon, {
    ...icon.props,
    className: mergedClassName,
    'aria-hidden': true,
    focusable: false,
  });
}

/* =====================
   Label
===================== */

export interface InfoRowLabelProps extends PropsWithChildren {
  className?: string;
}

function InfoRowLabel({ children, className }: InfoRowLabelProps) {
  useInfoRowContext('InfoRow.Label');

  return (
    <span className={[styles.infoLabel, className].filter(Boolean).join(' ')}>{children}</span>
  );
}

/* =====================
   Compound export
===================== */

export const InfoRow = Object.assign(InfoRowRoot, {
  Item: InfoRowItem,
  Icon: InfoRowIcon,
  Label: InfoRowLabel,
});

export default InfoRow;
