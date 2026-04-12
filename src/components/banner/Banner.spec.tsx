import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Banner from './Banner';
import { BannerImagePositionType } from './Banner';

describe('Banner', () => {
  const mockImageSet = {
    mobileSrc: '/mobile.jpg',
    tabletSrc: '/tablet.jpg',
    desktopSrc: '/desktop.jpg',
  };

  it('SHOULD render the heading text', () => {
    render(
      <Banner
        heading="Welcome"
        description="Get started"
        bannerImageSet={mockImageSet}
        bannerImageAlt="Banner"
      />
    );
    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument();
  });

  it('SHOULD render heading as h1 by default', () => {
    render(
      <Banner
        heading="Welcome"
        description="Get started"
        bannerImageSet={mockImageSet}
        bannerImageAlt="Banner"
      />
    );
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('SHOULD render heading as h2 when headingLevel is h2', () => {
    render(
      <Banner
        heading="Section"
        headingLevel="h2"
        description="Content"
        bannerImageSet={mockImageSet}
        bannerImageAlt="Banner"
      />
    );
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('SHOULD render heading as h3 when headingLevel is h3', () => {
    render(
      <Banner
        heading="Subsection"
        headingLevel="h3"
        description="Details"
        bannerImageSet={mockImageSet}
        bannerImageAlt="Banner"
      />
    );
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('SHOULD render the description text', () => {
    render(
      <Banner
        heading="Title"
        description="This is a description"
        bannerImageSet={mockImageSet}
        bannerImageAlt="Banner"
      />
    );
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('SHOULD render the banner image with correct alt text', () => {
    render(
      <Banner
        heading="Title"
        description="Description"
        bannerImageSet={mockImageSet}
        bannerImageAlt="Hero image"
      />
    );
    expect(screen.getByAltText('Hero image')).toBeInTheDocument();
  });

  it('SHOULD render children when provided', () => {
    render(
      <Banner
        heading="Title"
        description="Description"
        bannerImageSet={mockImageSet}
        bannerImageAlt="Banner"
      >
        <button>Call to action</button>
      </Banner>
    );
    expect(screen.getByRole('button', { name: 'Call to action' })).toBeInTheDocument();
  });

  it('SHOULD apply imageOnRight class when imagePosition is RIGHT', () => {
    const { container } = render(
      <Banner
        heading="Title"
        description="Description"
        bannerImageSet={mockImageSet}
        bannerImageAlt="Banner"
        imagePosition={BannerImagePositionType.RIGHT}
      />
    );
    const banner = container.querySelector('.imageOnRight');
    expect(banner).toBeInTheDocument();
  });

  it('SHOULD not apply imageOnRight class when imagePosition is LEFT', () => {
    const { container } = render(
      <Banner
        heading="Title"
        description="Description"
        bannerImageSet={mockImageSet}
        bannerImageAlt="Banner"
        imagePosition={BannerImagePositionType.LEFT}
      />
    );
    const banner = container.querySelector('.imageOnRight');
    expect(banner).not.toBeInTheDocument();
  });

  it('SHOULD apply custom className when provided', () => {
    const { container } = render(
      <Banner
        heading="Title"
        description="Description"
        bannerImageSet={mockImageSet}
        bannerImageAlt="Banner"
        className="custom-banner"
      />
    );
    const banner = container.querySelector('.custom-banner');
    expect(banner).toBeInTheDocument();
  });
});
