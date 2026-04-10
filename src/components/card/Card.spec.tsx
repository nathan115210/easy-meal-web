import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Card from './Card';

describe('Card', () => {
  const mockImageSet = {
    mobileSrc: '/mobile.jpg',
    tabletSrc: '/tablet.jpg',
    desktopSrc: '/desktop.jpg',
  };

  it('SHOULD render heading when provided', () => {
    render(<Card heading="Test Card" />);
    expect(screen.getByRole('heading', { level: 3, name: 'Test Card' })).toBeInTheDocument();
  });

  it('SHOULD render children when provided', () => {
    render(
      <Card heading="Test">
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('SHOULD render image when imageSet and imageAlt are provided', () => {
    render(<Card imageSet={mockImageSet} imageAlt="Card image" />);
    expect(screen.getByAltText('Card image')).toBeInTheDocument();
  });

  it('SHOULD not render image when imageSet is missing', () => {
    render(<Card imageAlt="Card image" heading="Test" />);
    expect(screen.queryByAltText('Card image')).not.toBeInTheDocument();
  });

  it('SHOULD not render image when imageAlt is missing', () => {
    render(<Card imageSet={mockImageSet} heading="Test" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('SHOULD render a chip label when label prop is provided', () => {
    render(<Card label="Featured" heading="Test" />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('SHOULD not render content section when neither heading nor children are provided', () => {
    const { container } = render(<Card imageSet={mockImageSet} imageAlt="Test" />);
    const content = container.querySelector('.content');
    expect(content).not.toBeInTheDocument();
  });

  it('SHOULD spread additional props to the root element', () => {
    render(<Card data-testid="custom-card" heading="Test" />);
    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
  });
});
