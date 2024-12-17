export function isEmptyOrUndefined(s: string | undefined) {
  return !s || s.length === 0;
}

export function entityWithUnavailableName(name: string, available: boolean): string {
  return available ? name : $localize`${name} (Ikke tilgængeligt)`;
}
