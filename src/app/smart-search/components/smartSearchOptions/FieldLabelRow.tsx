import styles from './smartSearchOptions.module.scss';
import Button from '@/components/button/Button';
import { Trash } from 'lucide-react';

export default function FieldLabelRow({
  label,
  onClear,
  showClear = false,
}: {
  label: string;
  onClear?: () => void;
  showClear?: boolean;
}) {
  return (
    <div className={styles.labelRow}>
      <span className={styles.fieldLabel}>{label}</span>
      {showClear && onClear && (
        <Button
          iconOnly
          onClick={onClear}
          aria-label="clear selections"
          variant="ghost"
          size={'compact'}
        >
          <Trash size={16} />
        </Button>
      )}
    </div>
  );
}
