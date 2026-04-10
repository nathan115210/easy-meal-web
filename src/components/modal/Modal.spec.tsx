import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import Modal from './Modal';

// Mock HTMLDialogElement methods since jsdom doesn't fully support them.
// showModal/close must update dialog.open so the component's useEffect guards work.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    Object.defineProperty(this, 'open', { value: true, writable: true, configurable: true });
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    Object.defineProperty(this, 'open', { value: false, writable: true, configurable: true });
  });
});

describe('Modal', () => {
  it('SHOULD provide context to child components', () => {
    render(
      <Modal>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Dialog>
          <Modal.Header title="Test Modal" />
          <Modal.Content>Content</Modal.Content>
        </Modal.Dialog>
      </Modal>
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('SHOULD open the modal when trigger is clicked', async () => {
    render(
      <Modal>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Dialog>
          <Modal.Header title="Test Modal" />
          <Modal.Content>Modal content</Modal.Content>
        </Modal.Dialog>
      </Modal>
    );
    await userEvent.click(screen.getByText('Open'));
    await waitFor(() => {
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });
  });

  it('SHOULD close the modal when close button is clicked', async () => {
    render(
      <Modal defaultOpen={true}>
        <Modal.Dialog>
          <Modal.Header title="Test Modal" />
          <Modal.Content>Content</Modal.Content>
        </Modal.Dialog>
      </Modal>
    );
    const closeButton = screen.getByRole('button', { name: 'close', hidden: true });
    await userEvent.click(closeButton);
    await waitFor(() => {
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });
  });

  it('SHOULD render modal header with title', () => {
    render(
      <Modal defaultOpen={true}>
        <Modal.Dialog>
          <Modal.Header title="My Modal" />
          <Modal.Content>Content</Modal.Content>
        </Modal.Dialog>
      </Modal>
    );
    expect(screen.getByRole('heading', { name: 'My Modal', hidden: true })).toBeInTheDocument();
  });

  it('SHOULD render modal content', () => {
    render(
      <Modal defaultOpen={true}>
        <Modal.Dialog>
          <Modal.Header title="Modal" />
          <Modal.Content>This is the content</Modal.Content>
        </Modal.Dialog>
      </Modal>
    );
    expect(screen.getByText('This is the content')).toBeInTheDocument();
  });

  it('SHOULD render modal footer when provided', () => {
    render(
      <Modal defaultOpen={true}>
        <Modal.Dialog>
          <Modal.Header title="Modal" />
          <Modal.Content>Content</Modal.Content>
          <Modal.Footer>
            <button>Cancel</button>
            <button>Save</button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('SHOULD call onOpenChange when modal opens', async () => {
    const onOpenChange = vi.fn();
    render(
      <Modal onOpenChange={onOpenChange}>
        <Modal.Trigger>Open</Modal.Trigger>
        <Modal.Dialog>
          <Modal.Header title="Modal" />
          <Modal.Content>Content</Modal.Content>
        </Modal.Dialog>
      </Modal>
    );
    await userEvent.click(screen.getByText('Open'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('SHOULD call onOpenChange when modal closes', async () => {
    const onOpenChange = vi.fn();
    render(
      <Modal defaultOpen={true} onOpenChange={onOpenChange}>
        <Modal.Dialog>
          <Modal.Header title="Modal" />
          <Modal.Content>Content</Modal.Content>
        </Modal.Dialog>
      </Modal>
    );
    await userEvent.click(screen.getByRole('button', { name: 'close', hidden: true }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('SHOULD support controlled mode with open prop', async () => {
    vi.clearAllMocks();
    const { rerender } = render(
      <Modal open={false}>
        <Modal.Dialog>
          <Modal.Header title="Modal" />
          <Modal.Content>Content</Modal.Content>
        </Modal.Dialog>
      </Modal>
    );
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();

    rerender(
      <Modal open={true}>
        <Modal.Dialog>
          <Modal.Header title="Modal" />
          <Modal.Content>Content</Modal.Content>
        </Modal.Dialog>
      </Modal>
    );
    await waitFor(() => {
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });
  });

  it('SHOULD support asChild mode for trigger', async () => {
    render(
      <Modal>
        <Modal.Trigger asChild>
          <button>Custom trigger</button>
        </Modal.Trigger>
        <Modal.Dialog>
          <Modal.Header title="Modal" />
          <Modal.Content>Content</Modal.Content>
        </Modal.Dialog>
      </Modal>
    );
    await userEvent.click(screen.getByText('Custom trigger'));
    await waitFor(() => {
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });
  });

  it('SHOULD support asChild mode for close button', async () => {
    vi.clearAllMocks();
    render(
      <Modal defaultOpen={true}>
        <Modal.Dialog>
          <Modal.Header title="Modal" />
          <Modal.Content>Content</Modal.Content>
          <Modal.Footer>
            <Modal.Close asChild>
              <button>Done</button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    );
    const doneButton = screen.getByText('Done');
    await userEvent.click(doneButton);
    await waitFor(() => {
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });
  });

  it('SHOULD apply aria-labelledby to dialog', () => {
    const { container } = render(
      <Modal defaultOpen={true}>
        <Modal.Dialog>
          <Modal.Header title="Accessible Modal" />
          <Modal.Content>Content</Modal.Content>
        </Modal.Dialog>
      </Modal>
    );
    const dialog = container.querySelector('dialog');
    const heading = screen.getByRole('heading', { name: 'Accessible Modal', hidden: true });
    expect(dialog).toHaveAttribute('aria-labelledby', heading.id);
  });

  it('SHOULD render header children for description', () => {
    render(
      <Modal defaultOpen={true}>
        <Modal.Dialog>
          <Modal.Header title="Modal">
            <p>This is a description</p>
          </Modal.Header>
          <Modal.Content>Content</Modal.Content>
        </Modal.Dialog>
      </Modal>
    );
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });
});
