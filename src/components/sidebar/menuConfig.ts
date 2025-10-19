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
    href: '/master',
    label: 'Master',
    child: [
      {
        href: '/master/clients',
        label: 'Clients',
        permission: 'clients.index',
      },
      {
        href: '/master/users',
        label: 'Users',
        permission: 'users.index',
      },
      {
        href: '/master/customer-data-structure',
        label: 'Customer Data Structure',
        permission: 'customerDataStructure.index',
      },
      {
        href: '/master/customers',
        label: 'Customers',
        permission: 'customers.index',
      },
      {
        href: '/master/tags',
        label: 'Tags',
        permission: 'tags.index',
      },
    ],
  },
  {
    href: '/content',
    label: 'Content',
    child: [
      {
        href: '/content/content-templates',
        label: 'Content Templates',
        permission: 'contentTemplate.index',
      },
      {
        href: '/content/broadcast-settings',
        label: 'Broadcast Settings',
        permission: 'broadcastSetting.index',
      },
    ],
  },
];
