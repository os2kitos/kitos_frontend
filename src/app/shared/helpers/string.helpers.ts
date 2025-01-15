export function isEmptyOrUndefined(s: string | undefined) {
  return !s || s.length === 0;
}

export function entityWithUnavailableName(name: string, available: boolean): string {
  return available ? name : $localize`${name} (Ikke tilgængeligt)`;
}

export function toBulletPoints(s: Array<string | undefined>): string {
  return s
    .filter((x) => x)
    .map((x) => `• ${x}`)
    .join('\n');
}
