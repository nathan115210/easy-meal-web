import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ButtonGroup from './ButtonGroup';

describe('ButtonGroup', () => {
  it('SHOULD render children correctly', () => {
    render(
      <ButtonGroup>
        <button>Button 1</button>
        <button>Button 2</button>
      </ButtonGroup>
    );
    expect(screen.getByText('Button 1')).toBeInTheDocument();
    expect(screen.getByText('Button 2')).toBeInTheDocument();
  });

  it('SHOULD render with role group', () => {
    render(
      <ButtonGroup>
        <button>Test</button>
      </ButtonGroup>
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('SHOULD apply aria-label when provided', () => {
    render(
      <ButtonGroup ariaLabel="Action buttons">
        <button>Test</button>
      </ButtonGroup>
    );
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-label', 'Action buttons');
  });

  it('SHOULD apply aria-labelledby when provided', () => {
    render(
      <ButtonGroup ariaLabelledBy="heading-id">
        <button>Test</button>
      </ButtonGroup>
    );
    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-labelledby', 'heading-id');
  });

  it('SHOULD apply default horizontal orientation class', () => {
    const { container } = render(
      <ButtonGroup>
        <button>Test</button>
      </ButtonGroup>
    );
    const group = container.querySelector('.buttonGroup');
    expect(group).toBeInTheDocument();
    expect(group).not.toHaveClass('vertical');
  });

  it('SHOULD apply vertical class when orientation is vertical', () => {
    const { container } = render(
      <ButtonGroup orientation="vertical">
        <button>Test</button>
      </ButtonGroup>
    );
    const group = container.querySelector('.vertical');
    expect(group).toBeInTheDocument();
  });

  it('SHOULD apply align center class when align is center', () => {
    const { container } = render(
      <ButtonGroup align="center">
        <button>Test</button>
      </ButtonGroup>
    );
    const group = container.querySelector('.alignCenter');
    expect(group).toBeInTheDocument();
  });

  it('SHOULD apply align end class when align is end', () => {
    const { container } = render(
      <ButtonGroup align="end">
        <button>Test</button>
      </ButtonGroup>
    );
    const group = container.querySelector('.alignEnd');
    expect(group).toBeInTheDocument();
  });

  it('SHOULD apply align between class when align is between', () => {
    const { container } = render(
      <ButtonGroup align="between">
        <button>Test</button>
      </ButtonGroup>
    );
    const group = container.querySelector('.alignBetween');
    expect(group).toBeInTheDocument();
  });

  it('SHOULD apply custom className when provided', () => {
    render(
      <ButtonGroup className="custom-group">
        <button>Test</button>
      </ButtonGroup>
    );
    const group = screen.getByRole('group');
    expect(group).toHaveClass('custom-group');
  });
});
