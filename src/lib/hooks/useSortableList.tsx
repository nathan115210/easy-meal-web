// useSortableList.ts
import { DragEndEvent } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

export function useSortableList<T extends object>(createEmptyItem: () => T, onChange?: (items: T[]) => void) {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState(() => [{ ...createEmptyItem(), id: crypto.randomUUID() }]);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleChange = (index: number, field: keyof T, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
    onChange?.(updated.map(({ id, ...rest }) => rest as T));
  };

  const handleAdd = () => {
    const newItem = { ...createEmptyItem(), id: crypto.randomUUID() };
    const updated = [...items, newItem];
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
