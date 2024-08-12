export const replaceOptionQuery = (filterUrl: string, optionName: string, emptyOptionKey: number): string => {
  if (filterUrl.indexOf(optionName) === -1) {
    return filterUrl; // optionName not found in filter so return original filter. Can be updated to .includes() instead of .indexOf() in later typescript versions
  }

  const pattern = new RegExp(`(.+)?(${optionName} eq '\\d')( and .+'\\)|\\)|)`, 'i');
  const key = extractOptionKey(filterUrl, optionName);
  if (key === emptyOptionKey) {
    return filterUrl.replace(pattern, `$1(${optionName} eq '${key}' or ${optionName} eq null)$3`);
  }
  return filterUrl;
};

const extractOptionKey = (filterRequest: string, optionName: string): number => {
  const pattern = new RegExp(`(.*\\(?${optionName} eq ')(\\d)('.*)`);
  const matchedString = filterRequest.replace(pattern, '$2');
  return parseInt(matchedString);
};
