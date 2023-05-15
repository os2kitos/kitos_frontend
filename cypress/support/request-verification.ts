// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyArrayContainsObject(arr: any[], obj: any) {
  return arr.some((entry) => {
    const keys = Object.keys(obj);
    return keys.every((key) => obj[key] === entry[key]);
  });
}
