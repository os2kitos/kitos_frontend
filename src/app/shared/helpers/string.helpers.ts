/**
 * Removes ALL trailing or leading slashes from a string
 * Example: '//something/////' -> 'something'
 * @param input
 * @returns
 */
export function removeAllLeadingAndTrailingSlashes(input: string): string {
  let trimmed = false;
  let trimmedInput = input;
  do {
    if (!trimmedInput) {
      trimmed = true;
    } else if (trimmedInput.endsWith('/')) {
      trimmedInput = trimmedInput.slice(0, -1);
    } else if (trimmedInput.startsWith('/')) {
      trimmedInput = trimmedInput.slice(1);
    } else {
      trimmed = true;
    }
  } while (!trimmed);

  return trimmedInput;
}
