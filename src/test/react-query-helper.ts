import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { createElement } from "react";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

export function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    createElement(QueryClientProvider, { client: queryClient }, ui),
  );
  return {
    ...result,
    rerender: (ui: React.ReactElement) =>
      rerender(createElement(QueryClientProvider, { client: queryClient }, ui)),
  };
}

export function createQueryWrapper() {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) => {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}
