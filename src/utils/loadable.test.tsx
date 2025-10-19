// loadable.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import loadable from './loadable';

// mock FullLoading so we don’t pull in Spinner
vi.mock('@/pages/others/FullLoading', () => ({
  default: () => <div data-testid="full-loading" />,
}));

// mock component to lazy-load
function MockComp() {
  return <div data-testid="mock-comp">Loaded!</div>;
}

describe('loadable', () => {
  it('shows fallback then renders lazy component', async () => {
    const LazyMock = loadable(() => Promise.resolve({ default: MockComp }));

    render(<LazyMock />);

    // initially shows FullLoading fallback
    expect(screen.getByTestId('full-loading')).toBeInTheDocument();

    // eventually renders the lazy component
    await waitFor(() => expect(screen.getByTestId('mock-comp')).toBeInTheDocument());
  });
});
