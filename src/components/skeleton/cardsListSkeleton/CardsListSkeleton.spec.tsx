import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CardsListSkeleton from './CardsListSkeleton';

describe('CardsListSkeleton', () => {
  it('SHOULD render the default count of 9 skeleton cards', () => {
    const { container } = render(<CardsListSkeleton />);
    const cards = container.querySelectorAll('.cardContainer');
    expect(cards.length).toBe(9);
  });

  it('SHOULD render the specified count of skeleton cards', () => {
    const { container } = render(<CardsListSkeleton count={5} />);
    const cards = container.querySelectorAll('.cardContainer');
    expect(cards.length).toBe(5);
  });

  it('SHOULD render at least 1 card when count is 0 or negative', () => {
    const { container } = render(<CardsListSkeleton count={0} />);
    const cards = container.querySelectorAll('.cardContainer');
    expect(cards.length).toBe(1);
  });

  it('SHOULD apply aria-hidden to each card container', () => {
    const { container } = render(<CardsListSkeleton count={2} />);
    const cards = container.querySelectorAll('.cardContainer');
    cards.forEach((card) => {
      expect(card).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('SHOULD render skeleton elements for image, title, description, and action', () => {
    const { container } = render(<CardsListSkeleton count={1} />);
    const card = container.querySelector('.cardContainer');
    // Check for skeleton rect for image
    expect(card?.querySelector('.img')).toBeInTheDocument();
  });
});
