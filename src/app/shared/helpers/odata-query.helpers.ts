export const replaceQueryByMultiplePropertyContains = (
  filterUrl: string,
  replaceQueryParameter: string,
  columnName: string,
  propertyNames: string[],
  addSlashBeforeProperty: boolean = true
) => {
  const pattern = new RegExp(`(\\w+\\()${replaceQueryParameter}(.*?\\))`, 'i');
  const matchingFilterPart = pattern.exec(filterUrl);
  if (matchingFilterPart?.length !== 3) {
    return filterUrl;
  }
  const userFilterQueryElements = matchingFilterPart[2]
    .replace(",'", '')
    .replace(/\)$/, '')
    .replace(/'$/, '')
    .split(' ');

  let result = '(';
  userFilterQueryElements.forEach((value, i) => {
    result += createContainsQueryForProperties(columnName, propertyNames, value, addSlashBeforeProperty);
    if (i < userFilterQueryElements.length - 1) {
      result += ' and ';
    } else {
      result += ')';
    }
  });

  filterUrl = filterUrl.replace(pattern, result);
  return filterUrl;
};

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

const createContainsQueryForProperties = (
  columnName: string,
  propertyNames: string[],
  searchValue: string,
  addSlashBeforeProperty: boolean
): string => {
  let result = '(';
  propertyNames.forEach((name, i) => {
    let propName = '';
    if (addSlashBeforeProperty) {
      propName = '/';
    }
    propName += name;

    result += `contains(${columnName}${propName},'${searchValue}')`;
    if (i < propertyNames.length - 1) {
      result += ' or ';
    }
  });
  result += ')';

  return result;
};

const extractOptionKey = (filterRequest: string, optionName: string): number => {
  const pattern = new RegExp(`(.*\\(?${optionName} eq ')(\\d)('.*)`);
  const matchedString = filterRequest.replace(pattern, '$2');
  return parseInt(matchedString);
};
