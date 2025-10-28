import { DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import useMounted from '@/lib/hooks/useMounted';

export function useSortableList<T extends object>(
  createEmptyItem: () => T,
  onChange?: (items: T[]) => void
) {
  const mounted = useMounted();

  const [items, setItems] = useState(() => [{ ...createEmptyItem(), id: crypto.randomUUID() }]);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const handleOnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over?.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onChange?.(newItems.map(({ id, ...rest }) => rest as T));
    }
  };

  // Optional: make this fully type-safe and drop the `any`
  const handleChange = <K extends keyof T>(index: number, field: K, value: T[K]) => {
    const updated = [...items];
    (updated[index] as T)[field] = value;
    setItems(updated);
    onChange?.(updated.map(({ id, ...rest }) => rest as T));
  };

  const handleAdd = () => {
    const updated = [...items, { ...createEmptyItem(), id: crypto.randomUUID() }];
    setItems(updated);
    onChange?.(updated.map(({ id, ...rest }) => rest as T));
    if (warningMessage !== null) setWarningMessage(null);
  };

  const handleDelete = (index: number) => {
    if (items.length === 1) {
      setWarningMessage('You must have at least one');
    } else {
      const updated = [...items];
      updated.splice(index, 1);
      setItems(updated);
      onChange?.(updated.map(({ id, ...rest }) => rest as T));
    }
  };

  return {
    items,
    mounted,
    warningMessage,
    handleOnDragEnd,
    handleChange,
    handleAdd,
    handleDelete,
  };
}
