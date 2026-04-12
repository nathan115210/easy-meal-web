import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Clock } from 'lucide-react';
import Chip from './Chip';

describe('Chip', () => {
  it('SHOULD render the label correctly', () => {
    render(<Chip label="Vegan" />);
    expect(screen.getByText('Vegan')).toBeInTheDocument();
  });

  it('SHOULD render as a span when type is label', () => {
    const { container } = render(<Chip label="Featured" type="label" />);
    const chip = container.querySelector('span[class*="chip"]');
    expect(chip).toBeInTheDocument();
  });

  it('SHOULD not be interactive when type is label', () => {
    render(<Chip label="Featured" type="label" />);
    const chip = screen.getByText('Featured');
    expect(chip.closest('span')).not.toHaveAttribute('role');
    expect(chip.closest('span')).not.toHaveAttribute('tabIndex');
  });

  it('SHOULD render as a button role when type is button', () => {
    render(<Chip label="Filter" type="button" onSelect={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('SHOULD render as a radio role when type is single-select', () => {
    render(<Chip label="Option 1" type="single-select" onSelect={vi.fn()} />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('SHOULD render as a checkbox role when type is multi-select', () => {
    render(<Chip label="Tag 1" type="multi-select" onSelect={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('SHOULD call onSelect when clicked', async () => {
    const onSelect = vi.fn();
    render(<Chip label="Click me" type="button" selected={false} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(true, expect.anything());
  });

  it('SHOULD toggle selected state when clicked', async () => {
    const onSelect = vi.fn();
    render(<Chip label="Toggle" type="button" selected={false} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(true, expect.anything());
  });

  it('SHOULD call onSelect when Enter key is pressed', async () => {
    const onSelect = vi.fn();
    render(<Chip label="Press me" type="button" onSelect={onSelect} />);
    const chip = screen.getByRole('button');
    chip.focus();
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('SHOULD call onSelect when Space key is pressed', async () => {
    const onSelect = vi.fn();
    render(<Chip label="Press me" type="button" onSelect={onSelect} />);
    const chip = screen.getByRole('button');
    chip.focus();
    await userEvent.keyboard(' ');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('SHOULD not call onSelect when disabled', async () => {
    const onSelect = vi.fn();
    render(<Chip label="Disabled" type="button" disabled onSelect={onSelect} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('SHOULD set tabIndex to -1 when disabled', () => {
    render(<Chip label="Disabled" type="button" disabled />);
    expect(screen.getByRole('button')).toHaveAttribute('tabIndex', '-1');
  });

  it('SHOULD set aria-disabled when disabled', () => {
    render(<Chip label="Disabled" type="button" disabled />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('SHOULD set aria-pressed for button type when onSelect is provided', () => {
    render(<Chip label="Toggle" type="button" selected={true} onSelect={vi.fn()} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('SHOULD set aria-checked for radio type', () => {
    render(<Chip label="Option" type="single-select" selected={true} onSelect={vi.fn()} />);
    expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'true');
  });

  it('SHOULD set aria-checked for checkbox type', () => {
    render(<Chip label="Tag" type="multi-select" selected={true} onSelect={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('SHOULD render delete button when deletable is true and onDelete is provided', () => {
    render(<Chip label="Removable" type="button" deletable onDelete={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('SHOULD call onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    render(<Chip label="Remove me" type="button" deletable onDelete={onDelete} />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('SHOULD not call onSelect when delete button is clicked', async () => {
    const onSelect = vi.fn();
    const onDelete = vi.fn();
    render(
      <Chip label="Remove me" type="button" deletable onSelect={onSelect} onDelete={onDelete} />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('SHOULD render a label icon when provided', () => {
    render(<Chip label="Timed" type="label" labelIcon={<Clock data-testid="clock-icon" />} />);
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
  });

  it('SHOULD apply sm size class', () => {
    const { container } = render(<Chip label="Small" size="sm" />);
    const chip = container.querySelector('.sm');
    expect(chip).toBeInTheDocument();
  });

  it('SHOULD apply lg size class', () => {
    const { container } = render(<Chip label="Large" size="lg" />);
    const chip = container.querySelector('.lg');
    expect(chip).toBeInTheDocument();
  });

  it('SHOULD apply selected class when selected is true', () => {
    const { container } = render(<Chip label="Selected" selected={true} />);
    const chip = container.querySelector('.selected');
    expect(chip).toBeInTheDocument();
  });

  it('SHOULD apply variant classes correctly', () => {
    const { container } = render(<Chip label="Primary" variant="primary" />);
    const chip = container.querySelector('.variantPrimary');
    expect(chip).toBeInTheDocument();
  });

  it('SHOULD apply custom className when provided', () => {
    render(<Chip label="Custom" className="custom-chip" />);
    const chip = screen.getByText('Custom').closest('[class*="chip"]');
    expect(chip).toHaveClass('custom-chip');
  });

  it('SHOULD forward refs to the root element', () => {
    const ref = vi.fn();
    render(<Chip label="Ref test" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
