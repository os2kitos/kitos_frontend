import { APIConnectionUpdateOrganizationUnitConsequenceDTO } from 'src/app/api/v2';

export interface FkOrgConnectionChangeTypeChoice {
  name: string;
  value: APIConnectionUpdateOrganizationUnitConsequenceDTO.CategoryEnum;
}

export const fkOrgConnectionChangeTypeChoiceOptions: FkOrgConnectionChangeTypeChoice[] = [
  {
    name: $localize`Tilføjet`,
    value: APIConnectionUpdateOrganizationUnitConsequenceDTO.CategoryEnum.Added,
  },
  {
    name: $localize`Omdøbt`,
    value: APIConnectionUpdateOrganizationUnitConsequenceDTO.CategoryEnum.Renamed,
  },
  {
    name: $localize`Flyttet`,
    value: APIConnectionUpdateOrganizationUnitConsequenceDTO.CategoryEnum.Moved,
  },
  {
    name: $localize`Konverteret`,
    value: APIConnectionUpdateOrganizationUnitConsequenceDTO.CategoryEnum.Deleted,
  },
  {
    name: $localize`Slettet`,
    value: APIConnectionUpdateOrganizationUnitConsequenceDTO.CategoryEnum.Converted,
  },
  {
    name: $localize`Organisationsrod erstattet`,
    value: APIConnectionUpdateOrganizationUnitConsequenceDTO.CategoryEnum.RootChanged,
  },
];

export const mapFkOrgConnectionChangeType = (
  value?: APIConnectionUpdateOrganizationUnitConsequenceDTO.CategoryEnum
): FkOrgConnectionChangeTypeChoice | undefined => {
  return fkOrgConnectionChangeTypeChoiceOptions.find((option) => option.value === value);
};
