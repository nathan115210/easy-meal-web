import React from 'react';
import styles from './infoRow.module.scss';

interface InfoRowItemProps {
  icon: React.JSX.Element;
  label: string;
}

const InfoRowItem: React.FC<InfoRowItemProps> = ({ icon, label }) => {
  return (
    <div className={styles.infoItem}>
      {React.cloneElement(icon, { className: styles.icon, 'aria-hidden': 'true' })}
      <span className={styles.infoLabel}>{label}</span>
    </div>
  );
};

export default InfoRowItem;
