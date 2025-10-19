import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { IUser } from '@/utils/types';
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_APP_STORAGE_SECRET_KEY ?? 'dibawahtipi';

interface UseAuthStore {
  token: string | undefined;
  currentUser: IUser | undefined;
  role: string | undefined;
  setToken: (token: string) => void;
  resetToken: () => void;
  setCurrentUser: (user: IUser) => void;
  resetCurrentUser: () => void;
  setRole: (role: string) => void;
  resetRole: () => void;
}

const useAuthStore = create<UseAuthStore>()(
  persist(
    set => ({
      token: undefined,
      currentUser: undefined,
      role: undefined,
      setToken: token => {
        set(() => ({ token: token }));
      },
      resetToken: () => {
        set(() => ({ token: undefined }));
      },
      setCurrentUser: (user: IUser) => {
        set(() => ({ currentUser: user }));
      },
      resetCurrentUser: () => {
        set(() => ({ currentUser: undefined }));
      },
      setRole: (role: string) => {
        set(() => ({ role: role }));
      },
      resetRole: () => {
        set(() => ({ role: undefined }));
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
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

export { useAuthStore };
