import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import BaseLink from './BaseLink';

// Mock Next.js Link to avoid router context issues in tests
vi.mock('next/link', () => ({
  default: vi.fn(({ children, ...props }) => <a {...props}>{children}</a>),
}));

describe('BaseLink', () => {
  it('SHOULD render children correctly', () => {
    render(<BaseLink href="/test">Link text</BaseLink>);
    expect(screen.getByText('Link text')).toBeInTheDocument();
  });

  it('SHOULD render as a link with the correct href', () => {
    render(<BaseLink href="/about">About</BaseLink>);
    const link = screen.getByText('About');
    expect(link.closest('a')).toHaveAttribute('href', '/about');
  });

  it('SHOULD apply default link variant styling', () => {
    const { container } = render(<BaseLink href="/test">Link</BaseLink>);
    const link = container.querySelector('.link--link');
    expect(link).toBeInTheDocument();
  });

  it('SHOULD apply button-like styling when variant is a button variant', () => {
    const { container } = render(
      <BaseLink href="/test" variant="primary">
        Primary
      </BaseLink>
    );
    const link = container.querySelector('[class*="button"]');
    expect(link).toBeInTheDocument();
  });

  it('SHOULD apply secondary button variant styling', () => {
    const { container } = render(
      <BaseLink href="/test" variant="secondary">
        Secondary
      </BaseLink>
    );
    const link = container.querySelector('[class*="button--secondary"]');
    expect(link).toBeInTheDocument();
  });

  it('SHOULD apply hover underline class by default', () => {
    const { container } = render(<BaseLink href="/test">Link</BaseLink>);
    const link = container.querySelector('.link--underline-hover');
    expect(link).toBeInTheDocument();
  });

  it('SHOULD apply always underline class when underline is always', () => {
    const { container } = render(
      <BaseLink href="/test" underline="always">
        Link
      </BaseLink>
    );
    const link = container.querySelector('.link--underline-always');
    expect(link).toBeInTheDocument();
  });

  it('SHOULD apply none underline class when underline is none', () => {
    const { container } = render(
      <BaseLink href="/test" underline="none">
        Link
      </BaseLink>
    );
    const link = container.querySelector('.link--underline-none');
    expect(link).toBeInTheDocument();
  });

  it('SHOULD call onClick when clicked', async () => {
    const onClick = vi.fn();
    render(
      <BaseLink href="/test" onClick={onClick}>
        Click me
      </BaseLink>
    );
    await userEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('SHOULD not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <BaseLink href="/test" disabled onClick={onClick}>
        Disabled link
      </BaseLink>
    );
    await userEvent.click(screen.getByText('Disabled link'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('SHOULD set aria-disabled when disabled is true', () => {
    render(
      <BaseLink href="/test" disabled>
        Disabled
      </BaseLink>
    );
    expect(screen.getByText('Disabled').closest('a')).toHaveAttribute('aria-disabled', 'true');
  });

  it('SHOULD set tabIndex to -1 when disabled', () => {
    render(
      <BaseLink href="/test" disabled>
        Disabled
      </BaseLink>
    );
    expect(screen.getByText('Disabled').closest('a')).toHaveAttribute('tabIndex', '-1');
  });

  it('SHOULD add noopener and noreferrer when target is _blank', () => {
    render(
      <BaseLink href="/external" target="_blank">
        External
      </BaseLink>
    );
    const link = screen.getByText('External').closest('a');
    const rel = link?.getAttribute('rel');
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  });

  it('SHOULD preserve custom rel when target is _blank', () => {
    render(
      <BaseLink href="/external" target="_blank" rel="author">
        External
      </BaseLink>
    );
    const link = screen.getByText('External').closest('a');
    const rel = link?.getAttribute('rel');
    expect(rel).toContain('author');
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  });

  it('SHOULD set role button when pressed prop is provided', () => {
    render(
      <BaseLink href="/test" pressed={true}>
        Toggle
      </BaseLink>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('SHOULD set aria-pressed when role is button and pressed is provided', () => {
    render(
      <BaseLink href="/test" pressed={true}>
        Toggle
      </BaseLink>
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('SHOULD not set aria-pressed for implicit link role', () => {
    render(<BaseLink href="/test">Link</BaseLink>);
    const link = screen.getByText('Link').closest('a');
    expect(link).not.toHaveAttribute('aria-pressed');
  });

  it('SHOULD hide children span when iconOnly is true', () => {
    const { container } = render(
      <BaseLink href="/test" iconOnly aria-label="Close">
        X
      </BaseLink>
    );
    // iconOnly mode does not render the link-span wrapper
    const linkSpan = container.querySelector('.link-span');
    expect(linkSpan).not.toBeInTheDocument();
  });

  it('SHOULD apply custom className when provided', () => {
    render(
      <BaseLink href="/test" className="custom-link">
        Link
      </BaseLink>
    );
    expect(screen.getByText('Link').closest('a')).toHaveClass('custom-link');
  });

  it('SHOULD forward refs to the anchor element', () => {
    const ref = vi.fn();
    render(
      <BaseLink href="/test" ref={ref}>
        Link
      </BaseLink>
    );
    expect(ref).toHaveBeenCalled();
  });

  it('SHOULD warn in development when iconOnly is true but aria-label is missing', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <BaseLink href="/test" iconOnly>
        X
      </BaseLink>
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Link: `iconOnly` requires an accessible label via `aria-label`.'
    );
    consoleSpy.mockRestore();
  });
});
