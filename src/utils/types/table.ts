/* eslint-disable @typescript-eslint/no-explicit-any */
import { Paginated } from './api';

export interface PaginatedData extends Paginated {
  content: { [key: string]: unknown }[];
}

export interface TableColumn {
  name: string;
  label: string;
  className?: string;
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

export interface FiltersTable {
  name: string;
  label: string;
  render: (filterItem: FiltersTable) => React.ReactNode;
}
