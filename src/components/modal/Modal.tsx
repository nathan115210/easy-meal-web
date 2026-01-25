'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import styles from './modal.module.scss';
import Button from '@/components/button/Button';
import { X } from 'lucide-react';

type ModalContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  dialogRef: React.RefObject<HTMLDialogElement | null> | null;
  titleId: string;
  descriptionId: string;
};

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext(componentName: string) {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error(`${componentName} must be used within <Modal>.`);
  return ctx;
}

type ModalProps = {
  children: React.ReactNode;
  open?: boolean; // controlled
  defaultOpen?: boolean; // uncontrolled
  onOpenChange?: (open: boolean) => void;
};

function ModalRoot({ children, open: openProp, defaultOpen = false, onOpenChange }: ModalProps) {
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = isControlled ? (openProp as boolean) : uncontrolledOpen;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const reactId = useId();
  const titleId = `modal-title-${reactId}`;
  const descriptionId = `modal-desc-${reactId}`;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  // Keep <dialog> state in sync with React state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const value = useMemo<ModalContextValue>(
    () => ({ open, setOpen, dialogRef, titleId, descriptionId }),
    [open, setOpen, titleId, descriptionId]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

type ClickableChild = React.ReactElement<{
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}>;

type ModalTriggerProps =
  | { asChild?: false; children: React.ReactNode } // default mode renders its own button
  | { asChild: true; children: ClickableChild }; // asChild mode clones child

function ModalTrigger(props: ModalTriggerProps) {
  const { setOpen, open } = useModalContext('Modal.Trigger');
  console.log('open', open);
  if (!props.asChild) {
    return (
      <button type="button" onClick={() => setOpen(true)}>
        {props.children}
      </button>
    );
  }

  const child = props.children;
  const childOnClick = child.props.onClick;

  return React.cloneElement(child, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      childOnClick?.(e);
      if (!e.defaultPrevented) setOpen(true);
    },
  });
}

type ModalDialogProps = React.ComponentPropsWithoutRef<'dialog'> & {
  children: React.ReactNode;
  closeOnBackdropClick?: boolean;
};

function ModalDialog({
  children,
  closeOnBackdropClick = true,
  onCancel,
  onClick,
  ...rest
}: ModalDialogProps) {
  const { dialogRef, setOpen, titleId, descriptionId } = useModalContext('Modal.Dialog');

  return (
    <dialog
      className={styles.modal}
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      {...rest}
      onCancel={(e) => {
        // ESC -> close
        onCancel?.(e);
        if (!e.defaultPrevented) {
          e.preventDefault(); // prevent native close so we control state
          setOpen(false);
        }
      }}
      onClose={() => {
        // Close can happen via dialog.close() or native UI; keep state in sync
        setOpen(false);
      }}
      onClick={(e) => {
        onClick?.(e);
        if (!closeOnBackdropClick) return;

        // Backdrop click: only close if click hit the <dialog> itself (not children)
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      {children}
    </dialog>
  );
}

type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title: React.ReactNode;
  children?: React.ReactNode;
};

function ModalHeader({ title, children, ...rest }: ModalHeaderProps) {
  const { titleId, descriptionId } = useModalContext('Modal.Header');
  const { setOpen } = useModalContext('Modal.Close');

  return (
    <header className={styles.header} {...rest}>
      <div className={styles.headerHeading}>
        <h1 id={titleId} className={styles.title}>
          {title}
        </h1>
        <Button
          size={'compact'}
          variant="ghost"
          aria-label={'close'}
          iconOnly
          onClick={() => setOpen(false)}
        >
          <X />
        </Button>
      </div>
      {children && (
        <div id={descriptionId} className={styles.headerChildren}>
          {children}
        </div>
      )}
    </header>
  );
}

type ModalContentProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

function ModalContent({ children, ...rest }: ModalContentProps) {
  useModalContext('Modal.Content');
  return (
    <div className={styles.content} {...rest}>
      {children}
    </div>
  );
}

type ModalFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

function ModalFooter({ children, ...rest }: ModalFooterProps) {
  useModalContext('Modal.Footer');
  return (
    <footer className={styles.footer} {...rest}>
      {children}
    </footer>
  );
}

type ModalCloseProps =
  | { asChild?: false; children: React.ReactNode }
  | { asChild: true; children: ClickableChild };

function ModalClose(props: ModalCloseProps) {
  const { setOpen } = useModalContext('Modal.Close');

  if (!props.asChild) {
    return <Button onClick={() => setOpen(false)}>{props.children}</Button>;
  }

  const child = props.children;
  const childOnClick = child.props.onClick;

  return React.cloneElement(child, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      childOnClick?.(e);
      if (!e.defaultPrevented) setOpen(false);
    },
  });
}

// Export
export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Dialog: ModalDialog,
  Header: ModalHeader,
  Content: ModalContent,
  Footer: ModalFooter,
  Close: ModalClose,
});

export default Modal;
