import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Home from './Home';

describe('Home Page', () => {
  test('renders home page content', () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByText('Welcome to the home page!')).toBeInTheDocument();
  });
});
