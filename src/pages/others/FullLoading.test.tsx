// FullLoading.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import FullLoading from './FullLoading';

// mock Spinner to avoid library internals
vi.mock('alurkerja-ui', () => ({
  Spinner: ({ size }: { size: number }) => <div data-testid="mock-spinner">spinner-size-{size}</div>,
}));

describe('FullLoading', () => {
  it('renders a centered spinner', () => {
    render(<FullLoading />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByTestId('mock-spinner')).toHaveTextContent('spinner-size-32');
  });
});
