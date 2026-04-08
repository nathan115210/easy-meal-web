// src/app/meals/components/MealsSkeletonCards.tsx
import React from 'react';
import { Col, ColProps } from '@/components/grid/Grid';
import Skeleton from '@/components/skeleton/Skeleton';
import styles from './cardsListSkeleton.module.scss';

type Props = {
  count?: number;
  gridLayout?: ColProps;
};

export default function CardsListSkeleton({
  count = 9,
  gridLayout = { sm: 12, md: 6, lg: 4, xl: 3 },
}: Props) {
  const items = Array.from({ length: Math.max(1, count) });

  return (
    <>
      {items.map((_, i) => (
        <Col key={i} {...gridLayout}>
          <div className={styles.cardContainer} aria-hidden="true">
            {/* image */}
            <Skeleton.Rect className={styles.img} width={'100%'} height={200} radius={6} />

            {/* title */}
            <Skeleton.Text lines={1} style={{ width: '60%' }} />

            {/* description (2 lines) */}
            <Skeleton.Text lines={2} style={{ width: '100%' }} />

            {/* action / button placeholder */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 6 }}>
              <Skeleton.Rect width={'100%'} height={34} radius={12} />
            </div>
          </div>
        </Col>
      ))}
    </>
  );
}
