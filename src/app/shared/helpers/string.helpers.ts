/**
 * Removes ALL trailing or leading slashes from a string
 * Example: '//something/////' -> 'something'
 * @param input
 * @returns
 */
export function removeAllLeadingAndTrailingSlashes(input: string): string {
  let trimmed = false;
  let trimmedInput = input;
  const forwardSlash = '/';
  do {
    if (!trimmedInput) {
      trimmed = true;
    } else if (trimmedInput.endsWith(forwardSlash)) {
      trimmedInput = trimmedInput.slice(0, -1);
    } else if (trimmedInput.startsWith(forwardSlash)) {
      trimmedInput = trimmedInput.slice(1);
    } else {
      trimmed = true;
    }
  } while (!trimmed);

  return trimmedInput;
}
