import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Clock } from 'lucide-react';
import { InfoRow } from './infoRow';

describe('InfoRow', () => {
  it('SHOULD render children correctly', () => {
    render(
      <InfoRow>
        <InfoRow.Item>
          <InfoRow.Icon icon={<Clock />} />
          <InfoRow.Label>30 mins</InfoRow.Label>
        </InfoRow.Item>
      </InfoRow>
    );
    expect(screen.getByText('30 mins')).toBeInTheDocument();
  });

  it('SHOULD apply custom className to root', () => {
    const { container } = render(
      <InfoRow className="custom-info-row">
        <InfoRow.Item>
          <InfoRow.Label>Test</InfoRow.Label>
        </InfoRow.Item>
      </InfoRow>
    );
    const root = container.querySelector('.custom-info-row');
    expect(root).toBeInTheDocument();
  });

  it('SHOULD throw error when Item is used outside InfoRow', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      render(
        <InfoRow.Item>
          <span>Test</span>
        </InfoRow.Item>
      );
    }).toThrow('InfoRow.Item must be used within <InfoRow>.');
    consoleError.mockRestore();
  });

  it('SHOULD throw error when Icon is used outside InfoRow', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      render(<InfoRow.Icon icon={<Clock />} />);
    }).toThrow('InfoRow.Icon must be used within <InfoRow>.');
    consoleError.mockRestore();
  });

  it('SHOULD throw error when Label is used outside InfoRow', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => {
      render(<InfoRow.Label>Test</InfoRow.Label>);
    }).toThrow('InfoRow.Label must be used within <InfoRow>.');
    consoleError.mockRestore();
  });

  it('SHOULD render multiple items correctly', () => {
    render(
      <InfoRow>
        <InfoRow.Item>
          <InfoRow.Icon icon={<Clock />} />
          <InfoRow.Label>30 mins</InfoRow.Label>
        </InfoRow.Item>
        <InfoRow.Item>
          <InfoRow.Label>Easy</InfoRow.Label>
        </InfoRow.Item>
      </InfoRow>
    );
    expect(screen.getByText('30 mins')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('SHOULD apply custom className to Item', () => {
    const { container } = render(
      <InfoRow>
        <InfoRow.Item className="custom-item">
          <InfoRow.Label>Test</InfoRow.Label>
        </InfoRow.Item>
      </InfoRow>
    );
    const item = container.querySelector('.custom-item');
    expect(item).toBeInTheDocument();
  });

  it('SHOULD apply custom className to Label', () => {
    const { container } = render(
      <InfoRow>
        <InfoRow.Item>
          <InfoRow.Label className="custom-label">Test</InfoRow.Label>
        </InfoRow.Item>
      </InfoRow>
    );
    const label = container.querySelector('.custom-label');
    expect(label).toBeInTheDocument();
  });

  it('SHOULD apply aria-hidden to icon', () => {
    const {} = render(
      <InfoRow>
        <InfoRow.Item>
          <InfoRow.Icon icon={<Clock data-testid="clock" />} />
          <InfoRow.Label>Test</InfoRow.Label>
        </InfoRow.Item>
      </InfoRow>
    );
    const icon = screen.getByTestId('clock');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('SHOULD apply focusable false to icon', () => {
    const {} = render(
      <InfoRow>
        <InfoRow.Item>
          <InfoRow.Icon icon={<Clock data-testid="clock" />} />
          <InfoRow.Label>Test</InfoRow.Label>
        </InfoRow.Item>
      </InfoRow>
    );
    const icon = screen.getByTestId('clock');
    expect(icon).toHaveAttribute('focusable', 'false');
  });

  it('SHOULD merge icon className with custom className', () => {
    const { container } = render(
      <InfoRow>
        <InfoRow.Item>
          <InfoRow.Icon icon={<Clock />} className="custom-icon" />
          <InfoRow.Label>Test</InfoRow.Label>
        </InfoRow.Item>
      </InfoRow>
    );
    const icon = container.querySelector('.custom-icon');
    expect(icon).toBeInTheDocument();
  });
});
