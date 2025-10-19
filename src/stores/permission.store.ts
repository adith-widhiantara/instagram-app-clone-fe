// src/stores/usePermissionStore.ts

import getNestedValue from '@/utils/helpers/getNestedValue';
import CryptoJS from 'crypto-js';
import { PermissionNode, transformPermissions } from '@/utils/helpers/transformPermission';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const SECRET_KEY = import.meta.env.VITE_APP_STORAGE_SECRET_KEY ?? 'dibawahtipi';

type PermissionCheck = string | string[];
type Operator = 'AND' | 'OR';

interface PermissionState {
  rawPermissions: string[];
  permissions: PermissionNode;
  resetPermissions: () => void;
  setPermissions: (newRawPermissions: string[]) => void;
  can: (permissionsToCheck: PermissionCheck, operator?: Operator) => boolean;
}

// 2. Bungkus fungsi create dengan persist
export const usePermissionStore = create<PermissionState>()(
  persist(
    (set, getStore) => ({
      // State dan actions Anda tetap sama, tidak ada yang berubah di sini
      rawPermissions: [],
      permissions: {},

      setPermissions: newRawPermissions => {
        const transformed = transformPermissions(newRawPermissions);
        set({
          rawPermissions: newRawPermissions,
          permissions: transformed,
        });
      },

      resetPermissions: () => {
        set({
          rawPermissions: [],
          permissions: {},
        });

        // 2. Hapus data dari storage secara eksplisit
        usePermissionStore.persist.clearStorage();
      },

      can: (permissionsToCheck, operator = 'OR') => {
        const { permissions } = getStore();
        const check = (p: string) => getNestedValue(permissions, p, false) as boolean;

        if (Array.isArray(permissionsToCheck)) {
          if (permissionsToCheck.length === 0) return true;
          return operator === 'AND' ? permissionsToCheck.every(check) : permissionsToCheck.some(check);
        }

        return check(permissionsToCheck);
      },
    }),
    {
      // 3. Konfigurasi untuk persist middleware
      name: 'auth-permissions-storage', // Nama kunci di localStorage
      // Di sini kita membuat custom storage engine dengan enkripsi 🔐
      storage: createJSONStorage(() => ({
        setItem: (key, value) => {
          const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
          localStorage.setItem(key, encryptedValue);
        },
        getItem: key => {
          const encryptedValue = localStorage.getItem(key);
          if (!encryptedValue) {
            return null;
          }
          try {
            const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
            const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedValue;
          } catch (e) {
            console.error('Failed to decrypt storage data', e);
            return null;
          }
        },
        removeItem: key => {
          localStorage.removeItem(key);
        },
      })),
    },
  ),
);
