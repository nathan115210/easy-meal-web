import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MealsInfiniteList from './MealsInfiniteList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookTimeValue, MealType } from '@/utils/types/meals';

// Mock the data fetcher
vi.mock('@/utils/data-server/fetchMealsData', () => ({
  default: vi.fn(() =>
    Promise.resolve({
      items: [
        {
          id: '1',
          title: 'Test Recipe',
          slug: 'test-recipe',
          image: '/test.jpg',
          description: 'A test recipe',
          cookTime: 30,
          difficulty: 'easy',
          mealType: ['lunch'],
          topTags: ['quick'],
          nutritionInfo: { calories: 400 },
        },
      ],
      hasMore: false,
    })
  ),
}));

// Mock the pathname hook
vi.mock('next/navigation', () => ({
  usePathname: () => '/meals',
}));

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('MealsInfiniteList', () => {
  it('SHOULD render loading skeleton initially', () => {
    const { container } = render(<MealsInfiniteList />, { wrapper });
    // CardsListSkeleton should render initially
    const skeletons = container.querySelectorAll('.cardContainer');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('SHOULD render recipe cards when data is loaded', async () => {
    render(<MealsInfiniteList />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    });
  });

  it('SHOULD render bottom line when no more pages', async () => {
    render(<MealsInfiniteList />, { wrapper });
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  it('SHOULD accept search parameter', () => {
    const { container } = render(<MealsInfiniteList search="pasta" />, { wrapper });
    expect(container).toBeInTheDocument();
  });

  it('SHOULD accept mealType parameter', () => {
    const { container } = render(<MealsInfiniteList mealType={[MealType.Lunch]} />, {
      wrapper,
    });
    expect(container).toBeInTheDocument();
  });

  it('SHOULD accept cookTime parameter', () => {
    const { container } = render(<MealsInfiniteList cookTime={CookTimeValue.Under30} />, {
      wrapper,
    });
    expect(container).toBeInTheDocument();
  });

  it('SHOULD accept custom grid layout', () => {
    const { container } = render(
      <MealsInfiniteList gridLayout={{ sm: 12, md: 6, lg: 6, xl: 4 }} />,
      { wrapper }
    );
    expect(container).toBeInTheDocument();
  });
});
