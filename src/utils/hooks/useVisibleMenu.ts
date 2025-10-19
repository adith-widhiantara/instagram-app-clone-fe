// src/hooks/useVisibleMenu.ts-- Impor fungsi pembersih

import { usePermissionStore } from '@/stores/permission.store';
import { useMemo } from 'react';
import { filterMenuByPermissions } from '../helpers/filterMenuByPermissions';
import { AppMenuConfig, menuConfig } from '@/components/sidebar/menuConfig';
import { cleanMenuForLibrary } from '../helpers/cleanMenuForLibrary';

export const useVisibleMenu = (): AppMenuConfig[] => {
  // Hook ini sekarang mengembalikan tipe asli library
  const can = usePermissionStore(state => state.can);

  const visibleAndCleanMenu = useMemo(() => {
    // 1. Filter menu menggunakan tipe AppMenuConfig
    const filteredMenu = filterMenuByPermissions(menuConfig, can);

    // 2. Bersihkan hasilnya sebelum dikembalikan
    const cleanedMenu = cleanMenuForLibrary(filteredMenu);

    return cleanedMenu;
  }, [can]);

  return visibleAndCleanMenu;
};
