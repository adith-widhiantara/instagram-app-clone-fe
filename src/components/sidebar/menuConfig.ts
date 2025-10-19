import { MenuConfig } from 'alurkerja-ui';

// 1. Buat tipe baru yang memperluas tipe library
export interface AppMenuConfig extends MenuConfig {
  permission?: string | string[];
  operator?: 'AND' | 'OR';
  child?: AppMenuConfig[];
}

export const menuConfig: AppMenuConfig[] = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '',
    label: 'Post',
    child: [
      {
        href: '/post',
        label: 'Timeline',
      },
      {
        href: '/post/add',
        label: 'Create',
      },
    ],
  },
];
