import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';

import Login from './Login';

// Mock the auth store
const mockSetToken = vi.fn();
const mockSetCurrentUser = vi.fn();
const mockSetRole = vi.fn();

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    setToken: mockSetToken,
    setCurrentUser: mockSetCurrentUser,
    setRole: mockSetRole,
  }),
}));

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the login API
const mockLoginMutate = vi.fn();
const mockLoginData = {
  isPending: false,
  mutate: mockLoginMutate,
};

vi.mock('@/api/auth', () => ({
  useLogin: () => mockLoginData,
}));

describe('Login Page', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
    mockLoginData.isPending = false;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const setup = () => {
    const utils = render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Login />
        </QueryClientProvider>
      </BrowserRouter>,
    );

    const btnLogin = screen.getByTestId('button-login');
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const forgotPasswordLink = screen.getByText(/forgot password\?/i);

    return {
      btnLogin,
      emailInput,
      passwordInput,
      forgotPasswordLink,
      ...utils,
    };
  };

  test('should render login form with all elements', () => {
    setup();

    expect(screen.getByText('Instagram Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByTestId('button-login')).toBeInTheDocument();
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
  });

  test('should show validation errors when fields are empty', async () => {
    const { btnLogin } = setup();

    fireEvent.click(btnLogin);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  test('should show email format validation error', async () => {
    const user = userEvent.setup();
    const { emailInput, btnLogin } = setup();

    await user.type(emailInput, 'invalid-email');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.click(btnLogin);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  test('should show password length validation error', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput, btnLogin } = setup();

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'short');
    fireEvent.click(btnLogin);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
    });
  });

  test('should handle successful login', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput, btnLogin } = setup();

    const mockResponse = {
      data: {
        data: {
          token: 'mock-token',
          user: {
            id: 1,
            full_name: 'Test User',
            email: 'test@example.com',
            master_client: {
              id: 1,
              name: 'Test Client',
            },
            role: {
              name: 'admin',
            },
          },
        },
      },
    };

    // Mock successful API response
    mockLoginMutate.mockImplementation((_credentials, options) => {
      options.onSuccess(mockResponse);
    });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    fireEvent.click(btnLogin);

    await waitFor(() => {
      expect(mockLoginMutate).toHaveBeenCalledWith(
        { email: 'test@example.com', password: 'password123' },
        expect.any(Object),
      );
    });

    expect(mockSetToken).toHaveBeenCalledWith('mock-token');
    expect(mockSetCurrentUser).toHaveBeenCalledWith({ ...mockResponse.data.data.user, role: 'admin' });
    expect(mockSetRole).toHaveBeenCalledWith('admin');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('should handle 422 login error with custom message', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput, btnLogin } = setup();

    const errorMessage = 'Invalid credentials';
    const error = {
      response: {
        status: 422,
        data: { message: errorMessage },
      },
    };

    // Mock error response
    mockLoginMutate.mockImplementation((_credentials, options) => {
      options.onError(error);
    });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    fireEvent.click(btnLogin);

    await waitFor(() => {
      expect(mockLoginMutate).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.getByTestId('alert-popup')).toBeInTheDocument();
  });

  test('should handle general login error', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput, btnLogin } = setup();

    const error = {
      response: {
        status: 500,
      },
    };

    // Mock error response
    mockLoginMutate.mockImplementation((_credentials, options) => {
      options.onError(error);
    });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    fireEvent.click(btnLogin);

    await waitFor(() => {
      expect(mockLoginMutate).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Login failed.')).toBeInTheDocument();
    });

    expect(screen.getByTestId('alert-popup')).toBeInTheDocument();
  });

  test('should show loading state during login', () => {
    // Mock loading state
    mockLoginData.isPending = true;

    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Login />
        </QueryClientProvider>
      </BrowserRouter>,
    );

    const loadingButton = screen.getByTestId('button-login');
    expect(loadingButton).toBeDisabled();

    // Reset loading state
    mockLoginData.isPending = false;
  });

  test('should navigate to forgot password page when link is clicked', () => {
    const { forgotPasswordLink } = setup();

    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
  });

  test('should allow typing in form fields', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput } = setup();

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('should clear error message when new login attempt is made', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput, btnLogin } = setup();

    // First login attempt - error
    const error = {
      response: {
        status: 422,
        data: { message: 'Invalid credentials' },
      },
    };

    mockLoginMutate.mockImplementation((_credentials, options) => {
      options.onError(error);
    });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    fireEvent.click(btnLogin);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    // Second login attempt - success
    const mockResponse = {
      data: {
        data: {
          token: 'token',
          user: { role: { name: 'user' } },
        },
      },
    };

    mockLoginMutate.mockImplementation((_credentials, options) => {
      options.onSuccess(mockResponse);
    });

    await user.clear(passwordInput);
    await user.type(passwordInput, 'correctpassword');
    fireEvent.click(btnLogin);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
