import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('SHOULD render the logo with correct alt text', () => {
    render(<Footer />);
    expect(screen.getByAltText('Easy Meal')).toBeInTheDocument();
  });

  it('SHOULD render the tagline', () => {
    render(<Footer />);
    expect(
      screen.getByText(/Refining the way you prepare, plan, and enjoy food/i)
    ).toBeInTheDocument();
  });

  it('SHOULD render the Explore navigation section with accessible label', () => {
    render(<Footer />);
    expect(screen.getByRole('navigation', { name: 'Explore' })).toBeInTheDocument();
  });

  it('SHOULD render the Planning navigation section with accessible label', () => {
    render(<Footer />);
    expect(screen.getByRole('navigation', { name: 'Planning' })).toBeInTheDocument();
  });

  it('SHOULD render the Support navigation section with accessible label', () => {
    render(<Footer />);
    expect(screen.getByRole('navigation', { name: 'Support' })).toBeInTheDocument();
  });

  it('SHOULD render all Explore links', () => {
    render(<Footer />);
    expect(screen.getByText('Browse Recipes')).toBeInTheDocument();
    expect(screen.getByText('Smart Search')).toBeInTheDocument();
    expect(screen.getByText('Seasonal Collections')).toBeInTheDocument();
    expect(screen.getByText('Dietary Filters')).toBeInTheDocument();
    expect(screen.getByText('Trending Now')).toBeInTheDocument();
  });

  it('SHOULD render all Planning links', () => {
    render(<Footer />);
    expect(screen.getByText('Weekly Planner')).toBeInTheDocument();
    expect(screen.getByText('Shopping Lists')).toBeInTheDocument();
    expect(screen.getByText('Meal Reminders')).toBeInTheDocument();
    expect(screen.getByText('Family Sharing')).toBeInTheDocument();
  });

  it('SHOULD render all Support links', () => {
    render(<Footer />);
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Community Tips')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('SHOULD render copyright with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Easy Meal Project. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('SHOULD render legal links', () => {
    render(<Footer />);
    const termsLinks = screen.getAllByText('Terms');
    const privacyLinks = screen.getAllByText(/Privacy/);
    expect(termsLinks.length).toBeGreaterThan(0);
    expect(privacyLinks.length).toBeGreaterThan(0);
    expect(screen.getByText('Cookies')).toBeInTheDocument();
  });
});
