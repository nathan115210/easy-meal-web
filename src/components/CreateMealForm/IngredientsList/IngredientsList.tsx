'use client';
import type { MealIngredient } from '@/types/meals';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import IngredientItem from '@/components/CreateMealForm/IngredientsList/IngredientItem';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import styles from './ingredientsList.module.scss';
import Cta from '@/components/Cta/Cta';
import { CtaSizes, CtaVariants } from '@/components/Cta/ctaType';
import { useSortableList } from '@/lib/hooks/useSortableList';

interface IngredientsListProps {
  id: string;
  onChange?: (ingredients: MealIngredient[]) => void;
}

export default function IngredientsList({ id, onChange }: IngredientsListProps) {
  const createEmptyIngredient = () => ({ text: '', amount: '' });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );
  const hook = useSortableList<MealIngredient>(createEmptyIngredient, onChange);
  const { items, mounted, warningMessage, handleOnDragEnd, handleChange, handleAdd, handleDelete } =
    hook;

  if (!mounted) return null;

  return (
    <div className={styles.ingredientsList} id={id}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleOnDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item, index) => (
            <IngredientItem
              key={item.id}
              id={item.id}
              item={item}
              onChange={(field, value) => handleChange(index, field, value)}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </SortableContext>

        <Cta
          className={styles['ingredientsList--add-more']}
          variant={CtaVariants.Ghost}
          size={CtaSizes.Small}
          onClick={handleAdd}
        >
          {' '}
          Add Ingredient
        </Cta>
        {warningMessage && <span className="warning-text">{warningMessage}</span>}
      </DndContext>
    </div>
  );
}
