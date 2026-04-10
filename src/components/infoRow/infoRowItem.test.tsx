import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Clock } from 'lucide-react';
import InfoRowItem from './infoRowItem';

describe('InfoRowItem', () => {
  it('SHOULD render the label text', () => {
    render(<InfoRowItem icon={<Clock />} label="30 mins" />);
    expect(screen.getByText('30 mins')).toBeInTheDocument();
  });

  it('SHOULD render the icon with aria-hidden attribute', () => {
    const { container } = render(<InfoRowItem icon={<Clock data-testid="icon" />} label="Test" />);
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });

  it('SHOULD apply the icon className', () => {
    const { container } = render(<InfoRowItem icon={<Clock />} label="Test" />);
    const icon = container.querySelector('.icon');
    expect(icon).toBeInTheDocument();
  });

  it('SHOULD apply the label className', () => {
    const { container } = render(<InfoRowItem icon={<Clock />} label="Test" />);
    const label = container.querySelector('.infoLabel');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Test');
  });
});
