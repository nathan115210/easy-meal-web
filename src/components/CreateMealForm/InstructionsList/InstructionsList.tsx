import styles from './instructionsList.module.scss';
import InstructionItem from '@/components/CreateMealForm/InstructionsList/InstructionItem';
import { type MealInstruction } from '@/types/meals';

import { closestCenter, DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Cta from '@/components/Cta/Cta';
import { CtaSizes, CtaVariants } from '@/components/Cta/ctaType';
import { useSortableList } from '@/lib/hooks/useSortableList';

interface InstructionsListProps {
  id: string;
  onChange?: (instructions: MealInstruction[]) => void;
}

export default function InstructionsList({ id, onChange }: InstructionsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );
  const createEmptyInstruction = () => ({ text: '' });

  const sortableListHook = useSortableList<MealInstruction>(createEmptyInstruction, onChange);
  const { items, mounted, warningMessage, handleOnDragEnd, handleChange, handleAdd, handleDelete } = sortableListHook;

  if (!mounted) return null;

  return (
    <div id={id} className={styles.instructionsList}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleOnDragEnd} modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {items.map((item, index) => {
            return (
              <InstructionItem key={item.id} id={item.id} item={item} stepNumber={index + 1} onChange={(field, value) => handleChange(index, field, value)} onDelete={() => handleDelete(index)} />
            );
          })}
        </SortableContext>

        <Cta className={styles['instructionsList--add-more']} variant={CtaVariants.Ghost} size={CtaSizes.Small} onClick={handleAdd}>
          {' '}
          Add More step
        </Cta>
        {warningMessage && <span className="warning-text">{warningMessage}</span>}
      </DndContext>
    </div>
  );
}
