import { describe, expect, it } from 'vitest';
import { DynamicField, DynamicFieldSpec } from './DynamicField';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';

const queryClient = new QueryClient();

describe('DynamicField', () => {
  const createMemoryRouter = ({ spec }: { spec: DynamicFieldSpec[] }) => {
    const Wrapper = () => {
      const form = useForm();
      return (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/dynamic-field']}>
            <Routes>
              <Route path="/dynamic-field" element={<DynamicField spec={spec} form={form} />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );
    };

    return render(<Wrapper />);
  };

  it('render dynamic field component', () => {
    const spec: DynamicFieldSpec[] = [
      { id: '1', field_name: 'Is Active', field_type: 'boolean', required: true, value: 'true' },
      { id: '2', field_name: 'Description', field_type: 'string', required: false, value: '' },
      { id: '3', field_name: 'Title', field_type: 'string', required: true, value: '' },
    ];

    createMemoryRouter({ spec });

    expect(screen.getByDisplayValue(/Is Active/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Description/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Title/i)).toBeInTheDocument();
  });
});
