import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FeatureBanner from './FeatureBanner';

describe('FeatureBanner', () => {
  const mockImageSet = {
    mobileSrc: '/mobile.jpg',
    tabletSrc: '/tablet.jpg',
    desktopSrc: '/desktop.jpg',
  };

  it('SHOULD render the heading', () => {
    render(
      <FeatureBanner
        heading="Discover"
        description="Find new recipes"
        imageSet={mockImageSet}
        imageAlt="Feature"
      />
    );
    expect(screen.getByRole('heading', { name: 'Discover' })).toBeInTheDocument();
  });

  it('SHOULD render the description', () => {
    render(
      <FeatureBanner
        heading="Feature"
        description="This is a feature description"
        imageSet={mockImageSet}
        imageAlt="Feature"
      />
    );
    expect(screen.getByText('This is a feature description')).toBeInTheDocument();
  });

  it('SHOULD render the image with correct alt text', () => {
    render(
      <FeatureBanner
        heading="Feature"
        description="Description"
        imageSet={mockImageSet}
        imageAlt="Feature image"
      />
    );
    expect(screen.getByAltText('Feature image')).toBeInTheDocument();
  });

  it('SHOULD render the icon when provided', () => {
    render(
      <FeatureBanner
        heading="Feature"
        description="Description"
        imageSet={mockImageSet}
        imageAlt="Feature"
        icon={<span data-testid="custom-icon">🎉</span>}
      />
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('SHOULD render the CTA link when ctaText and ctaHref are provided', () => {
    render(
      <FeatureBanner
        heading="Feature"
        description="Description"
        imageSet={mockImageSet}
        imageAlt="Feature"
        ctaText="Learn more"
        ctaHref="/learn"
      />
    );
    const link = screen.getByText('Learn more').closest('a');
    expect(link).toHaveAttribute('href', '/learn');
  });

  it('SHOULD not render the CTA link when ctaText is missing', () => {
    render(
      <FeatureBanner
        heading="Feature"
        description="Description"
        imageSet={mockImageSet}
        imageAlt="Feature"
        ctaHref="/learn"
      />
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('SHOULD not render the CTA link when ctaHref is missing', () => {
    render(
      <FeatureBanner
        heading="Feature"
        description="Description"
        imageSet={mockImageSet}
        imageAlt="Feature"
        ctaText="Learn more"
      />
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('SHOULD apply overlayBottom variant class by default', () => {
    const { container } = render(
      <FeatureBanner
        heading="Feature"
        description="Description"
        imageSet={mockImageSet}
        imageAlt="Feature"
      />
    );
    const banner = container.querySelector('.overlayBottom');
    expect(banner).toBeInTheDocument();
  });

  it('SHOULD apply overlayLeft variant class when variant is overlayLeft', () => {
    const { container } = render(
      <FeatureBanner
        heading="Feature"
        description="Description"
        imageSet={mockImageSet}
        imageAlt="Feature"
        variant="overlayLeft"
      />
    );
    const banner = container.querySelector('.overlayLeft');
    expect(banner).toBeInTheDocument();
  });

  it('SHOULD apply split variant class when variant is split', () => {
    const { container } = render(
      <FeatureBanner
        heading="Feature"
        description="Description"
        imageSet={mockImageSet}
        imageAlt="Feature"
        variant="split"
      />
    );
    const banner = container.querySelector('.split');
    expect(banner).toBeInTheDocument();
  });

  it('SHOULD render gradient element only for overlay variants', () => {
    const { container } = render(
      <FeatureBanner
        heading="Feature"
        description="Description"
        imageSet={mockImageSet}
        imageAlt="Feature"
        variant="overlayBottom"
      />
    );
    const gradient = container.querySelector('.gradient');
    expect(gradient).toBeInTheDocument();
    expect(gradient).toHaveAttribute('aria-hidden', 'true');
  });

  it('SHOULD not render gradient element for split variant', () => {
    const { container } = render(
      <FeatureBanner
        heading="Feature"
        description="Description"
        imageSet={mockImageSet}
        imageAlt="Feature"
        variant="split"
      />
    );
    const gradient = container.querySelector('.gradient');
    expect(gradient).not.toBeInTheDocument();
  });

  it('SHOULD apply custom className when provided', () => {
    const { container } = render(
      <FeatureBanner
        heading="Feature"
        description="Description"
        imageSet={mockImageSet}
        imageAlt="Feature"
        className="custom-banner"
      />
    );
    const banner = container.querySelector('.custom-banner');
    expect(banner).toBeInTheDocument();
  });
});
