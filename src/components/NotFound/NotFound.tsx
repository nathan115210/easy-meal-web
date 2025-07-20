import React from 'react';
import styles from './NotFound.module.scss';
import Cta from '@/components/Cta/Cta';

interface NotFoundProps {
  message: string;
  ctaHref: string;
  ctaText: string;
}

export default function NotFound(props: NotFoundProps) {
  const { message, ctaHref, ctaText } = props;
  return (
    <div className={styles['not-found']}>
      <div className={styles['not-found__card']}>
        <h1 className={styles['not-found__heading']}>404</h1>
        <p className={styles['not-found__message']}>{message}</p>
        <Cta href={ctaHref} className={styles['not-found__cta']}>
          {ctaText}
        </Cta>
      </div>
    </div>
  );
}
