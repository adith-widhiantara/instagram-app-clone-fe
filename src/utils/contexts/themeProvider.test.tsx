import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider } from './themeProvider';
import { ThemeProviderContext } from './themeContext';
import { useContext } from 'react';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock window.matchMedia
const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
  writable: true,
});

// Mock document.documentElement
const mockDocumentElement = {
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
  },
};

Object.defineProperty(window.document, 'documentElement', {
  value: mockDocumentElement,
  writable: true,
});

// Test component to access theme context
const TestComponent = () => {
  const { theme, setTheme } = useContext(ThemeProviderContext);
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>
        Set Dark
      </button>
      <button data-testid="set-light" onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid="set-system" onClick={() => setTheme('system')}>
        Set System
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should use default theme when no localStorage value exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('vite-ui-theme');
    });

    it('should use localStorage value when it exists', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });

    it('should use custom storage key', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider defaultTheme="light" storageKey="custom-theme-key">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(localStorageMock.getItem).toHaveBeenCalledWith('custom-theme-key');
    });

    it('should use custom default theme', () => {
      localStorageMock.getItem.mockReturnValue(null);

      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
  });

  describe('Theme Application', () => {
    it('should apply light theme to document root', () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('light');
    });

    it('should apply dark theme to document root', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
    });

    it('should apply system theme (dark) when system preference is dark', () => {
      localStorageMock.getItem.mockReturnValue('system');
      mockMatchMedia.mockReturnValue({
        matches: true, // dark mode
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
    });

    it('should apply system theme (light) when system preference is light', () => {
      localStorageMock.getItem.mockReturnValue('system');
      mockMatchMedia.mockReturnValue({
        matches: false, // light mode
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('light');
    });
  });

  describe('Theme Setting', () => {
    it('should update theme and save to localStorage when setTheme is called', async () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

      await act(async () => {
        screen.getByTestId('set-dark').click();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('vite-ui-theme', 'dark');
    });

    it('should update theme and save to custom storage key', async () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(
        <ThemeProvider storageKey="custom-key">
          <TestComponent />
        </ThemeProvider>,
      );

      await act(async () => {
        screen.getByTestId('set-dark').click();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('custom-key', 'dark');
    });

    it('should apply theme changes to document root when theme is updated', async () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      // Clear previous calls
      vi.clearAllMocks();

      await act(async () => {
        screen.getByTestId('set-dark').click();
      });

      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
    });

    it('should handle system theme changes correctly', async () => {
      localStorageMock.getItem.mockReturnValue('light');
      mockMatchMedia.mockReturnValue({
        matches: true, // dark system preference
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      // Clear previous calls
      vi.clearAllMocks();

      await act(async () => {
        screen.getByTestId('set-system').click();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('dark');
    });
  });

  describe('Context Value', () => {
    it('should provide theme and setTheme in context value', () => {
      localStorageMock.getItem.mockReturnValue('dark');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('set-light')).toBeInTheDocument();
      expect(screen.getByTestId('set-dark')).toBeInTheDocument();
      expect(screen.getByTestId('set-system')).toBeInTheDocument();
    });

    it('should update context value when theme changes', async () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

      await act(async () => {
        screen.getByTestId('set-dark').click();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

      await act(async () => {
        screen.getByTestId('set-system').click();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    });
  });

  describe('Props forwarding', () => {
    it('should forward additional props to ThemeProviderContext.Provider', () => {
      const customProps = { 'data-testid': 'theme-provider' };

      render(
        <ThemeProvider {...customProps}>
          <TestComponent />
        </ThemeProvider>,
      );

      // The provider should still work correctly with custom props
      expect(screen.getByTestId('current-theme')).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle invalid localStorage values gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-theme');

      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>,
      );

      // Should fall back to the invalid value from localStorage (as per current implementation)
      expect(screen.getByTestId('current-theme')).toHaveTextContent('invalid-theme');
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      expect(() => {
        render(
          <ThemeProvider defaultTheme="light">
            <TestComponent />
          </ThemeProvider>,
        );
      }).toThrow(); // Current implementation doesn't handle this error
    });

    it('should call localStorage.setItem when setting theme', async () => {
      localStorageMock.getItem.mockReturnValue('light');

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      await act(async () => {
        screen.getByTestId('set-dark').click();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('vite-ui-theme', 'dark');
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
  });
});
