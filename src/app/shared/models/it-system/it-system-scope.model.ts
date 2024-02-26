import { APIItSystemResponseDTO } from 'src/app/api/v2';

export interface ScopeChoice {
  name: string;
  value: APIItSystemResponseDTO.ScopeEnum;
}

export const scopeOptions: ScopeChoice[] = [
  {
    name: $localize`Lokal`,
    value: APIItSystemResponseDTO.ScopeEnum.Local,
  },
  {
    name: $localize`Offentlig`,
    value: APIItSystemResponseDTO.ScopeEnum.Global,
  },
];

export const mapItSystemScopeToString = (value: APIItSystemResponseDTO.ScopeEnum): ScopeChoice | undefined => {
  return scopeOptions.find((option) => option.value === value);
};
