import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import Skeleton from './Skeleton';

// Helper so we don’t repeat the option everywhere
const getPresentation = () => screen.getByRole('presentation', { hidden: true });

describe('Skeleton (rect default)', () => {
  it('renders a rect skeleton with aria-hidden and presentation role', () => {
    render(<Skeleton width={120} height={16} radius={8} />);
    const node = getPresentation();
    expect(node).toBeInTheDocument();
    expect(node).toHaveAttribute('aria-hidden', 'true');

    const style = node.getAttribute('style') ?? '';
    expect(style).toContain('--sk-width: 120px');
    expect(style).toContain('--sk-height: 16px');
    expect(style).toContain('--sk-radius: 8px');
  });

  it('applies custom className and merges inline style', () => {
    render(<Skeleton className="custom-class" style={{ marginTop: 10 }} />);
    const node = getPresentation();
    expect(node.className).toMatch(/custom-class/);
    expect((node as HTMLElement).style.marginTop).toBe('10px');
  });

  it('omits shimmer class when shimmer={false}', () => {
    render(<Skeleton shimmer={false} />);
    const node = getPresentation();
    expect(node.className).not.toMatch(/shimmer/);
  });

  it("adds pill class for variant='pill'", () => {
    render(<Skeleton variant="pill" />);
    const node = getPresentation();
    expect(node.className).toMatch(/pill/);
  });
});

describe('Skeleton.Text', () => {
  it('renders 3 lines by default and makes the last line 60% width', () => {
    const { container } = render(<Skeleton variant="text" />);
    const group = container.querySelector("div[aria-hidden='true']");
    expect(group).toBeInTheDocument();

    const lines = group!.querySelectorAll('span');
    expect(lines.length).toBe(3);

    const lastStyle = lines[lines.length - 1].getAttribute('style') ?? '';
    const firstStyle = lines[0].getAttribute('style') ?? '';
    expect(lastStyle).toContain('--sk-line-width: 60%');
    expect(firstStyle).toContain('--sk-line-width: 100%');
  });

  it('respects lines prop but never goes below 1', () => {
    let r = render(<Skeleton variant="text" lines={5} />);
    expect(r.container.querySelectorAll('span').length).toBe(5);
    r.unmount();

    r = render(<Skeleton variant="text" lines={0} />);
    expect(r.container.querySelectorAll('span').length).toBe(1);
  });
});

describe('Skeleton.Circle', () => {
  it('uses default size 40 and radius 9999px', () => {
    render(<Skeleton.Circle />);
    const node = getPresentation();
    const style = node.getAttribute('style') ?? '';
    expect(style).toContain('--sk-width: 40px');
    expect(style).toContain('--sk-height: 40px');
    expect(style).toContain('--sk-radius: 9999px');
  });

  it('accepts a custom size', () => {
    render(<Skeleton.Circle size={24} />);
    const node = getPresentation();
    const style = node.getAttribute('style') ?? '';
    expect(style).toContain('--sk-width: 24px');
    expect(style).toContain('--sk-height: 24px');
  });
});

describe('Convenience components', () => {
  it("Skeleton.Rect delegates to base variant='rect'", () => {
    render(<Skeleton.Rect width={100} height={20} />);
    const node = getPresentation();
    const style = node.getAttribute('style') ?? '';
    expect(style).toContain('--sk-width: 100px');
    expect(style).toContain('--sk-height: 20px');
  });

  it('Skeleton.Pill sets pill class', () => {
    render(<Skeleton.Pill width={120} height={28} />);
    const node = getPresentation();
    expect(node.className).toMatch(/pill/);
  });
});
