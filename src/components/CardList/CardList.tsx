import React from 'react';
import Card, { type CardProps } from '@/components/Card/Card';
import styles from './cardList.module.scss';

interface CardListProps {
  heading?: string;
  items: CardProps[];
}

const CardList = ({ heading, items }: CardListProps) => {
  if (items.length === 0) return null;
  return (
    <div className={styles.cardList}>
      {heading && <h2 className={styles.cardList__heading}>{heading}</h2>}
      <ul className={styles.cardList__list}>
        {items.map((item, index) => {
          return (
            <li key={`${item.id}-${index}`} className={styles.cardList__list__item}>
              <Card {...item} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default CardList;
