'use client';
import styles from './instructionsList.module.scss';
import React from 'react';
import { UpDwnArrowIcon } from '@/components/Svg/Svg';
import IconButton, { IconName } from '@/components/IconButton/IconButton';
import type { MealInstruction } from '@/types/meals';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ImagePicker from '@/components/ImagePicker/ImagePicker';

interface InstructionItemProps {
  id: string;
  item: MealInstruction;
  onChange: (field: keyof MealInstruction, value: string) => void;
  onDelete: () => void;
  stepNumber: number;
}

export default function InstructionItem({ id, item, onChange, onDelete, stepNumber }: InstructionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className={styles.instructionsListItem} ref={setNodeRef} style={style} {...attributes}>
      <div className={styles.header}>
        <div className={styles.controllers} {...listeners}>
          <span className={`${styles.selector} cursor-move text-xl select-none`}>
            <UpDwnArrowIcon />
          </span>
          <div className={styles.stepNumber}>Step {stepNumber}</div>
        </div>
        <IconButton iconName={IconName.close} onClick={onDelete} />
      </div>
      <ImagePicker name={`${item.text}-image`} draggable />

      <textarea id={'instructions'} name={'instructions'} value={item.text} onChange={(e) => onChange('text', e.target.value)} className={styles['input-text']} required />
    </div>
  );
}
