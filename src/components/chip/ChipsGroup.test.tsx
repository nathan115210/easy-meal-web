import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ChipsGroup from './ChipsGroup';

describe('ChipsGroup', () => {
  it('SHOULD render children correctly', () => {
    render(
      <ChipsGroup>
        <span>Chip 1</span>
        <span>Chip 2</span>
      </ChipsGroup>
    );
    expect(screen.getByText('Chip 1')).toBeInTheDocument();
    expect(screen.getByText('Chip 2')).toBeInTheDocument();
  });

  it('SHOULD not apply a role when selectionMode is none', () => {
    const { container } = render(
      <ChipsGroup selectionMode="none">
        <span>Chip</span>
      </ChipsGroup>
    );
    const group = container.firstChild as HTMLElement;
    expect(group).not.toHaveAttribute('role');
  });

  it('SHOULD apply role radiogroup when selectionMode is single', () => {
    render(
      <ChipsGroup selectionMode="single">
        <span>Chip</span>
      </ChipsGroup>
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('SHOULD apply role group when selectionMode is multiple', () => {
    render(
      <ChipsGroup selectionMode="multiple">
        <span>Chip</span>
      </ChipsGroup>
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('SHOULD apply aria-label when provided', () => {
    render(
      <ChipsGroup selectionMode="single" ariaLabel="Filter options">
        <span>Chip</span>
      </ChipsGroup>
    );
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAttribute('aria-label', 'Filter options');
  });

  it('SHOULD apply aria-labelledby when provided', () => {
    render(
      <ChipsGroup selectionMode="multiple" ariaLabelledby="filter-heading">
        <span>Chip</span>
      </ChipsGroup>
    );
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-labelledby', 'filter-heading');
  });

  it('SHOULD apply custom className when provided', () => {
    const { container } = render(
      <ChipsGroup className="custom-chips">
        <span>Chip</span>
      </ChipsGroup>
    );
    const group = container.firstChild as HTMLElement;
    expect(group).toHaveClass('custom-chips');
  });
});
