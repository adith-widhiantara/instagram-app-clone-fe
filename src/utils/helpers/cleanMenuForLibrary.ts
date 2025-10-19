/* eslint-disable @typescript-eslint/no-unused-vars */
// src/utils/cleanMenu.ts

import { AppMenuConfig } from '@/components/sidebar/menuConfig';
import { MenuConfig } from 'alurkerja-ui';

/**
 * Membersihkan properti custom (permission, operator) dari menu config
 * agar sesuai dengan tipe data yang diharapkan oleh library.
 * @param items Array menu yang masih memiliki properti custom.
 * @returns Array menu yang bersih dan siap digunakan oleh library.
 */
export const cleanMenuForLibrary = (items: AppMenuConfig[]): MenuConfig[] => {
  return items.map(item => {
    // Ambil properti custom kita dan buang
    const { permission, operator, child, ...libraryProps } = item;

    // Buat objek baru yang hanya berisi properti yang dikenali library
    const cleanedItem: MenuConfig = { ...libraryProps };

    // Jika ada anak, bersihkan juga secara rekursif
    if (child && child.length > 0) {
      cleanedItem.child = cleanMenuForLibrary(child);
    }

    return cleanedItem;
  });
};
