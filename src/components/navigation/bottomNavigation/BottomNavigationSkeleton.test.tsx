import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BottomNavigationSkeleton from './BottomNavigationSkeleton';

describe('BottomNavigationSkeleton', () => {
  it('SHOULD render 4 skeleton pill elements', () => {
    const { container } = render(<BottomNavigationSkeleton />);
    const pills = container.querySelectorAll('[role="presentation"]');
    // Skeleton.Pill components render with role="presentation"
    expect(pills.length).toBe(4);
  });

  it('SHOULD render within a skeleton container', () => {
    const { container } = render(<BottomNavigationSkeleton />);
    const skeletonContainer = container.querySelector('.skeletonContainer');
    expect(skeletonContainer).toBeInTheDocument();
  });
});
