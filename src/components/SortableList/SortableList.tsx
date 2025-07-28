'use client';
import type { MealIngredient } from '@/types/meals';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import SortableListItem from '@/components/SortableList/SortableListItem';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import styles from './sortableList.module.scss';
import Cta from '@/components/Cta/Cta';
import { CtaSizes, CtaVariants } from '@/components/Cta/ctaType';

interface MealIngredientWithId extends MealIngredient {
  id: string;
}

interface SortableListProps {
  id: string;
  onChange?: (ingredients: MealIngredient[]) => void;
}

const initialItems: MealIngredientWithId[] = [{ id: crypto.randomUUID(), text: '', amount: '' }];

export default function SortableList({ id, onChange }: SortableListProps) {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<MealIngredientWithId[]>(() => initialItems);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleOnDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over?.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onChange?.(newItems.map(({ id, ...rest }) => rest));
    }
  };

  const handleChange = (index: number, field: keyof MealIngredient, value: string) => {
    console.log('called');
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
    onChange?.(updated.map(({ id, ...rest }) => rest));
  };

  const handleAdd = () => {
    const newItem: MealIngredientWithId = { id: crypto.randomUUID(), text: '', amount: '' };
    setItems([...items, newItem]);
    onChange?.([...items, newItem].map(({ id, ...rest }) => rest));
    if (warningMessage !== null) {
      setWarningMessage(null);
    }
  };

  const handleDelete = (index: number) => {
    if (items.length === 1) {
      setWarningMessage('You must have at least one');
    } else {
      const updated = [...items];
      updated.splice(index, 1);
      setItems(updated);
      onChange?.(updated.map(({ id, ...rest }) => rest));
    }
  };

  if (!mounted) return null;

  return (
    <div className={styles.sortableList} id={id}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleOnDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => (
            <SortableListItem key={item.id} id={item.id} item={item} onChange={(field, value) => handleChange(index, field, value)} onDelete={() => handleDelete(index)} />
          ))}
        </SortableContext>

        <Cta className={styles['sortableList--add-more']} variant={CtaVariants.Ghost} size={CtaSizes.Small} onClick={handleAdd}>
          {' '}
          Add Ingredient
        </Cta>
        {warningMessage && <span>{warningMessage}</span>}
      </DndContext>
    </div>
  );
}
