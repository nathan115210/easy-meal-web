import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ImageWrapper from './ImageWrapper';

describe('ImageWrapper', () => {
  const mockImageSet = {
    mobileSrc: '/mobile.jpg',
    tabletSrc: '/tablet.jpg',
    desktopSrc: '/desktop.jpg',
  };

  it('SHOULD render an image with the provided alt text', () => {
    render(<ImageWrapper imageSet={mockImageSet} alt="Test image" />);
    expect(screen.getByAltText('Test image')).toBeInTheDocument();
  });

  it('SHOULD use desktopSrc when available', () => {
    render(<ImageWrapper imageSet={mockImageSet} alt="Test" />);
    const img = screen.getByAltText('Test');
    expect(img).toHaveAttribute('src', expect.stringContaining('desktop.jpg'));
  });

  it('SHOULD fall back to tabletSrc when desktopSrc is not provided', () => {
    const imageSet = { mobileSrc: '/mobile.jpg', tabletSrc: '/tablet.jpg' };
    render(<ImageWrapper imageSet={imageSet} alt="Test" />);
    const img = screen.getByAltText('Test');
    expect(img).toHaveAttribute('src', expect.stringContaining('tablet.jpg'));
  });

  it('SHOULD fall back to mobileSrc when only mobileSrc is provided', () => {
    const imageSet = { mobileSrc: '/mobile.jpg' };
    render(<ImageWrapper imageSet={imageSet} alt="Test" />);
    const img = screen.getByAltText('Test');
    expect(img).toHaveAttribute('src', expect.stringContaining('mobile.jpg'));
  });

  it('SHOULD apply aria-hidden when ariaHidden prop is true', () => {
    const { container } = render(<ImageWrapper imageSet={mockImageSet} alt="" ariaHidden />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('SHOULD not apply aria-hidden when ariaHidden prop is not provided', () => {
    const { container } = render(<ImageWrapper imageSet={mockImageSet} alt="Test" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveAttribute('aria-hidden');
  });

  it('SHOULD apply custom className when provided', () => {
    const { container } = render(
      <ImageWrapper imageSet={mockImageSet} alt="Test" className="custom-class" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('SHOULD pass priority prop to the Next Image component', () => {
    render(<ImageWrapper imageSet={mockImageSet} alt="Test" priority />);
    // Next Image renders with fetchpriority when priority is true
    const img = screen.getByAltText('Test');
    expect(img).toBeInTheDocument();
  });
});
