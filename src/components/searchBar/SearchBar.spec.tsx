import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from './SearchBar';

// Mock Next.js navigation hooks
const mockPush = vi.fn();
const mockPathname = '/meals';
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

describe('SearchBar', () => {
  it('SHOULD render a search form with role search', () => {
    render(<SearchBar ariaLabel="Search recipes" inputId="search" />);
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('SHOULD render an input with the correct id', () => {
    render(<SearchBar ariaLabel="Search" inputId="recipe-search" />);
    expect(screen.getByTestId('search-bar-input')).toHaveAttribute('id', 'recipe-search');
  });

  it('SHOULD render an input with type search', () => {
    render(<SearchBar ariaLabel="Search" inputId="search" />);
    expect(screen.getByTestId('search-bar-input')).toHaveAttribute('type', 'search');
  });

  it('SHOULD render a label for the input with assistiveText class', () => {
    render(<SearchBar ariaLabel="Search recipes" inputId="search" />);
    const label = screen.getByText('Search recipes');
    expect(label).toHaveClass('assistiveText');
    expect(label).toHaveAttribute('for', 'search');
  });

  it('SHOULD render with default placeholder', () => {
    render(<SearchBar ariaLabel="Search" inputId="search" />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('SHOULD render with custom placeholder', () => {
    render(
      <SearchBar ariaLabel="Search" inputId="search" placeholder="Find recipes, ingredients..." />
    );
    expect(screen.getByPlaceholderText('Find recipes, ingredients...')).toBeInTheDocument();
  });

  it('SHOULD use the default input name of search', () => {
    render(<SearchBar ariaLabel="Search" inputId="search" />);
    expect(screen.getByTestId('search-bar-input')).toHaveAttribute('name', 'search');
  });

  it('SHOULD use a custom input name when provided', () => {
    render(<SearchBar ariaLabel="Search" inputId="search" inputName="query" />);
    expect(screen.getByTestId('search-bar-input')).toHaveAttribute('name', 'query');
  });

  it('SHOULD update input value when user types', async () => {
    render(<SearchBar ariaLabel="Search" inputId="search" />);
    const input = screen.getByTestId('search-bar-input');
    await userEvent.type(input, 'pasta');
    expect(input).toHaveValue('pasta');
  });

  it('SHOULD navigate to action path when input is cleared', async () => {
    render(<SearchBar ariaLabel="Search" inputId="search" defaultValue="test" />);
    const input = screen.getByTestId('search-bar-input');
    await userEvent.clear(input);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/meals');
    });
  });

  it('SHOULD apply custom className when provided', () => {
    const { container } = render(
      <SearchBar ariaLabel="Search" inputId="search" classname="custom-search" />
    );
    const form = container.querySelector('.custom-search');
    expect(form).toBeInTheDocument();
  });

  it('SHOULD set autocomplete to off', () => {
    render(<SearchBar ariaLabel="Search" inputId="search" />);
    expect(screen.getByTestId('search-bar-input')).toHaveAttribute('autocomplete', 'off');
  });

  it('SHOULD set form method to get', () => {
    render(<SearchBar ariaLabel="Search" inputId="search" />);
    const form = screen.getByRole('search');
    expect(form).toHaveAttribute('method', 'get');
  });

  it('SHOULD set form action to the computed search action', () => {
    render(<SearchBar ariaLabel="Search" inputId="search" />);
    const form = screen.getByRole('search');
    expect(form).toHaveAttribute('action', '/meals');
  });
});
