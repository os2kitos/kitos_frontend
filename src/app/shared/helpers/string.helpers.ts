/**
 * Removes ALL trailing or leading slashes from a string
 * Example: '//something/////' -> 'something'
 * @param input
 * @returns
 */
export function removeAllLeadingAndTrailingSlashes(input: string): string {
  if (!input) {
    return input;
  } else if (input.endsWith('/')) {
    return removeAllLeadingAndTrailingSlashes(input.slice(0, -1));
  } else if (input.startsWith('/')) {
    return removeAllLeadingAndTrailingSlashes(input.slice(1));
  }
  return input;
}
