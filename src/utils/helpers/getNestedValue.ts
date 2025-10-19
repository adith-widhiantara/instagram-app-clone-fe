/* eslint-disable @typescript-eslint/no-explicit-any */
export default function getNestedValue(obj: any, path: string, defaultValue: any = undefined) {
  const pathArray = path.split('.');

  const result = pathArray.reduce((accumulator, key) => {
    // Logika traversal Anda tetap sama
    if (accumulator && typeof accumulator === 'object' && key in accumulator) {
      return accumulator[key];
    }
    return undefined;
  }, obj);

  // Jika hasil akhirnya adalah undefined, kembalikan defaultValue.
  // Jika tidak, kembalikan hasil yang ditemukan (bisa null, false, 0, dll).
  return result === undefined ? defaultValue : result;
}
