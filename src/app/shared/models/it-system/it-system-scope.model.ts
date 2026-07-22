import { APIRegistrationScopeChoice } from 'src/app/api/v2';

export interface ScopeChoice {
  name: string;
  value: APIRegistrationScopeChoice;
}

export const scopeOptions: ScopeChoice[] = [
  {
    name: $localize`Lokal`,
    value: APIRegistrationScopeChoice.Local,
  },
  {
    name: $localize`Offentlig`,
    value: APIRegistrationScopeChoice.Global,
  },
];

export const mapScopeEnumToScopeChoice = (value: APIRegistrationScopeChoice): ScopeChoice | undefined => {
  return scopeOptions.find((option) => option.value === value);
};
