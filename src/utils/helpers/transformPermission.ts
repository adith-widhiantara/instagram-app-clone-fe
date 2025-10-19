// src/utils/transformPermissions.ts

// Tipe ini mendefinisikan sebuah node dalam pohon izin.
// Nilainya bisa berupa boolean (izin akhir) atau node lain (bersarang).
export type PermissionNode = {
  [key: string]: boolean | PermissionNode;
};

export const transformPermissions = (permissions: string[]): PermissionNode => {
  if (!Array.isArray(permissions)) {
    return {};
  }

  const transformed: PermissionNode = {};

  permissions.forEach(permissionString => {
    const keys = permissionString.split('.');
    let currentLevel: PermissionNode = transformed;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        currentLevel[key] = true;
      } else {
        // Pastikan level berikutnya adalah objek sebelum melanjut
        if (typeof currentLevel[key] !== 'object' || currentLevel[key] === null) {
          currentLevel[key] = {};
        }
        currentLevel = currentLevel[key];
      }
    });
  });

  return transformed;
};
