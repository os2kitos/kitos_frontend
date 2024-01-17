import { APIItSystemResponseDTO } from 'src/app/api/v2';

export const mapItSystemScopeToString = (value: APIItSystemResponseDTO.ScopeEnum): string | undefined => {
  switch (value) {
    case APIItSystemResponseDTO.ScopeEnum.Local:
      return $localize`Lokal`;
    case APIItSystemResponseDTO.ScopeEnum.Global:
      return $localize`Offentlig`;
    default:
      return undefined;
  }
};
