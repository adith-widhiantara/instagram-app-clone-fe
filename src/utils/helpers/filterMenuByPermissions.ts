// src/utils/filterMenu.ts

import { AppMenuConfig } from '@/components/sidebar/menuConfig';

// Tipe untuk fungsi 'can' agar type-safe
type CanFunction = (permissions: string | string[], operator?: 'AND' | 'OR') => boolean;

export const filterMenuByPermissions = (menuItems: AppMenuConfig[], can: CanFunction): AppMenuConfig[] => {
  return menuItems.reduce((filteredList, item) => {
    // 1. Cek apakah pengguna punya izin untuk item ini
    const hasPermission = !item.permission || can(item.permission, item.operator);

    // Jika tidak punya izin, jangan tampilkan item ini sama sekali
    if (!hasPermission) {
      return filteredList;
    }

    // 2. Jika item punya sub-menu (child), filter sub-menu tersebut secara rekursif
    let visibleChildren: AppMenuConfig[] = [];
    if (item.child) {
      visibleChildren = filterMenuByPermissions(item.child, can);
    }

    // 3. Tentukan apakah item ini harus ditampilkan
    // - Jika ini adalah parent menu, ia hanya tampil jika setidaknya satu child-nya juga tampil.
    // - Jika ini adalah menu biasa (tanpa child), ia akan tampil karena sudah lolos cek izin di atas.
    if (item.child && visibleChildren.length === 0) {
      // Ini adalah parent menu tanpa child yang visible, jadi sembunyikan
      return filteredList;
    }

    // Tambahkan item ke daftar yang akan ditampilkan
    filteredList.push({
      ...item,
      // Pastikan hanya menyertakan properti 'child' jika memang ada dan tidak kosong
      ...(item.child && { child: visibleChildren }),
    });

    return filteredList;
  }, [] as AppMenuConfig[]);
};
