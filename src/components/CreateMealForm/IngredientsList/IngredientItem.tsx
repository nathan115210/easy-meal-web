'use client';

import type { MealIngredient } from '@/types/meals';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import IconButton, { IconName } from '@/components/IconButton/IconButton';
import styles from './ingredientsList.module.scss';
import { UpDwnArrowIcon } from '@/components/Svg/Svg';

export interface IngredientItemProps {
  id: string;
  item: MealIngredient;
  onChange: (field: keyof MealIngredient, value: string) => void;
  onDelete: () => void;
}

export default function IngredientItem({ id, item, onChange, onDelete }: IngredientItemProps) {
  const isAsNeeded = (item.amount ?? '').trim().toLowerCase() === 'As needed';
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const [showCustomAmount, setShowCustomAmount] = useState(!isAsNeeded);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={styles['ingredientsList-item']}>
      <span className={`${styles.selector} cursor-move text-xl select-none`} {...listeners}>
        <UpDwnArrowIcon />
      </span>
      <div className={styles['ingredientsList-item--fields']}>
        <div className={styles.inlineFields}>
          <input
            className={styles.field}
            value={item.text ?? ''}
            onChange={(e) => onChange('text', e.target.value)}
            placeholder="Ingredient"
            required
          />

          <input
            className={styles.field}
            type={'text'}
            value={item.amount ?? ''}
            onChange={(e) => onChange('amount', e.target.value)}
            placeholder="Amount"
            readOnly={isAsNeeded}
            required
          />
        </div>
      </div>

      <div className={styles['ingredientsList-item--edit']}>
        {!showCustomAmount ? (
          <IconButton
            iconName={IconName.pen}
            onClick={() => {
              onChange('amount', '');
              setShowCustomAmount(true);
            }}
          />
        ) : (
          <>
            <IconButton
              onClick={() => {
                onChange('amount', 'As needed');
                setShowCustomAmount(false);
              }}
              iconName={IconName.asterisk}
            />
          </>
        )}

        <IconButton iconName={IconName.close} onClick={onDelete} />
      </div>
    </div>
  );
}
