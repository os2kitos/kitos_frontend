export const copyObject = <T>(objectToCopy: T): T => {
  return JSON.parse(JSON.stringify(objectToCopy));
};
