export function compareLocaleNames(name1: string, name2: string) {
  const localeName1 = name1.toLocaleLowerCase();
  const localeName2 = name2.toLocaleLowerCase();
  if (localeName1 < localeName2) {
    return -1;
  }
  if (localeName1 > localeName2) {
    return 1;
  }
  return 0;
}
