import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from 'alurkerja-ui';
import Unauthorized from './Unauthorized';

describe('Unauthorized Page', () => {
  const queryClient = new QueryClient();

  const setup = () => {
    const axiosInstance = axios.create({
      headers: {
        'Content-type': 'application/json',
      },
    });

    const utils = render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={axiosInstance}>
            <Unauthorized />
          </AuthContext.Provider>
        </QueryClientProvider>
      </BrowserRouter>,
    );

    const logo = screen.getByTestId('title');
    const message = screen.getByTestId('message');

    return {
      ...utils,
      logo,
      message,
    };
  };

  test('Should render logo & message', () => {
    const { logo, message } = setup();

    expect(logo).toBeInTheDocument();
    expect(message).toBeInTheDocument();

    expect(logo).toHaveTextContent('Unauthorize');
    expect(message).toHaveTextContent('Sorry for the inconvenience, please contact the administrator');
  });
});
