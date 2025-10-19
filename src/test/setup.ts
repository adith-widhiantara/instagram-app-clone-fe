import { afterAll, afterEach, beforeAll, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { setupServer } from 'msw/node';
import { cleanup } from '@testing-library/react';
import type { IUser } from '@/utils/types';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

interface MockAuthState {
  token: string | undefined;
  currentUser: IUser | undefined;
}

let mockAuthState: MockAuthState;
export const server = setupServer();

export const setMockAuthState = (partial: Partial<MockAuthState>) => {
  mockAuthState = { ...mockAuthState, ...partial };
  // notify subscribers when manually updating
  mockListeners.forEach(l => l());
};

type Selector<TState, TResult> = (state: TState) => TResult;

type UseAuthStoreHook = {
  (): MockAuthState;
  <T>(selector: Selector<MockAuthState, T>): T;
  setState: (updater: Partial<MockAuthState> | ((state: MockAuthState) => Partial<MockAuthState>)) => void;
  getState: () => MockAuthState;
  subscribe: (listener: () => void) => () => void;
};

const mockListeners: Array<() => void> = [];

vi.mock('@/stores/auth.store', () => {
  const setState: UseAuthStoreHook['setState'] = updater => {
    const next = typeof updater === 'function' ? updater(mockAuthState) : updater;
    mockAuthState = { ...mockAuthState, ...next };
    mockListeners.forEach(l => l());
  };
  const getState: UseAuthStoreHook['getState'] = () => mockAuthState;
  const subscribe: UseAuthStoreHook['subscribe'] = listener => {
    mockListeners.push(listener);
    return () => {
      const idx = mockListeners.indexOf(listener);
      if (idx >= 0) mockListeners.splice(idx, 1);
    };
  };
  const base = (<T>(selector?: Selector<MockAuthState, T>) =>
    selector ? selector(getState()) : getState()) as UseAuthStoreHook;
  base.setState = setState;
  base.getState = getState;
  base.subscribe = subscribe;
  return { useAuthStore: base };
});

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
  // nothing now; mock defined above
});

beforeEach(() => {
  // reset mock auth state to pristine before each test
  mockAuthState = { token: undefined, currentUser: undefined };
});

afterAll(() => {
  server.close();
  vi.clearAllMocks();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});
