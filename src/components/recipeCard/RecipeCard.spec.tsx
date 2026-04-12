import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RecipeCard from './RecipeCard';

describe('RecipeCard', () => {
  const mockImageSet = {
    mobileSrc: '/mobile.jpg',
    tabletSrc: '/tablet.jpg',
    desktopSrc: '/desktop.jpg',
  };

  const defaultProps = {
    title: 'Chocolate Cake',
    imageSet: mockImageSet,
    imageAlt: 'Delicious cake',
    time: '45 mins',
    difficulty: 'Medium',
    category: 'Dessert',
    href: '/recipe/chocolate-cake',
  };

  it('SHOULD render as a link with the correct href', () => {
    render(<RecipeCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/recipe/chocolate-cake');
  });

  it('SHOULD render as an article element', () => {
    render(<RecipeCard {...defaultProps} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('SHOULD render the recipe title', () => {
    render(<RecipeCard {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Chocolate Cake' })).toBeInTheDocument();
  });

  it('SHOULD render the recipe image with correct alt text', () => {
    render(<RecipeCard {...defaultProps} />);
    expect(screen.getByAltText('Delicious cake')).toBeInTheDocument();
  });

  it('SHOULD render the cooking time', () => {
    render(<RecipeCard {...defaultProps} />);
    expect(screen.getByText('45 mins')).toBeInTheDocument();
  });

  it('SHOULD render the difficulty level', () => {
    render(<RecipeCard {...defaultProps} />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('SHOULD render the category badge', () => {
    render(<RecipeCard {...defaultProps} />);
    expect(screen.getByText('Dessert')).toBeInTheDocument();
  });

  it('SHOULD render the bookmark button with accessible name', () => {
    render(<RecipeCard {...defaultProps} />);
    const bookmarkBtn = screen.getByRole('button', { name: 'Save Chocolate Cake' });
    expect(bookmarkBtn).toBeInTheDocument();
    expect(bookmarkBtn).toHaveAttribute('type', 'button');
  });

  it('SHOULD render time and difficulty icons with aria-hidden', () => {
    const { container } = render(<RecipeCard {...defaultProps} />);
    const hiddenIcons = container.querySelectorAll('[aria-hidden="true"]');
    // Expect at least the clock and chef hat icons
    expect(hiddenIcons.length).toBeGreaterThanOrEqual(2);
  });

  it('SHOULD render image overlay with aria-hidden', () => {
    const { container } = render(<RecipeCard {...defaultProps} />);
    const overlay = container.querySelector('.imageOverlay');
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });
});
