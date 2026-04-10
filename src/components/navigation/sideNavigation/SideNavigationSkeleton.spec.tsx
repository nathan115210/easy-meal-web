import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SideNavigationSkeleton from './SideNavigationSkeleton';

describe('SideNavigationSkeleton', () => {
  it('SHOULD render the logo with correct alt text', () => {
    render(<SideNavigationSkeleton />);
    expect(screen.getByAltText('Your brand')).toBeInTheDocument();
  });

  it('SHOULD render 6 skeleton pill elements', () => {
    const { container } = render(<SideNavigationSkeleton />);
    const pills = container.querySelectorAll('[role="presentation"]');
    // Skeleton.Pill components render with role="presentation"
    expect(pills.length).toBe(6);
  });

  it('SHOULD render within a skeleton container', () => {
    const { container } = render(<SideNavigationSkeleton />);
    const skeletonContainer = container.querySelector('.skeletonContainer');
    expect(skeletonContainer).toBeInTheDocument();
  });
});
