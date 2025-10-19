interface Params {
  [key: string]: string | string[] | number | boolean | undefined;
}
export function generateParams(params: Params): string {
  let result = '?';
  const paramsArray = Object.entries(params);
  for (let i = 0; i < paramsArray.length; i++) {
    const [key, value] = paramsArray[i];
    if (key && key !== 'tab' && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
      result += `${key}=${value}`;
      if (i < paramsArray.length - 1) {
        result += '&';
      }
    }
  }

  return result;
}
