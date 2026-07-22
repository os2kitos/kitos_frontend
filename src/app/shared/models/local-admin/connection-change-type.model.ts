import { APIConnectionUpdateOrganizationUnitChangeType } from 'src/app/api/v2';

export interface FkOrgConnectionChangeTypeChoice {
  name: string;
  value: APIConnectionUpdateOrganizationUnitChangeType;
}

export const fkOrgConnectionChangeTypeChoiceOptions: FkOrgConnectionChangeTypeChoice[] = [
  {
    name: $localize`Tilføjet`,
    value: APIConnectionUpdateOrganizationUnitChangeType.Added,
  },
  {
    name: $localize`Omdøbt`,
    value: APIConnectionUpdateOrganizationUnitChangeType.Renamed,
  },
  {
    name: $localize`Flyttet`,
    value: APIConnectionUpdateOrganizationUnitChangeType.Moved,
  },
  {
    name: $localize`Slettet`,
    value: APIConnectionUpdateOrganizationUnitChangeType.Deleted,
  },
  {
    name: $localize`Konverteret`,
    value: APIConnectionUpdateOrganizationUnitChangeType.Converted,
  },
  {
    name: $localize`Organisationsrod erstattet`,
    value: APIConnectionUpdateOrganizationUnitChangeType.RootChanged,
  },
];

export const mapFkOrgConnectionChangeType = (
  value?: APIConnectionUpdateOrganizationUnitChangeType,
): FkOrgConnectionChangeTypeChoice | undefined => {
  return fkOrgConnectionChangeTypeChoiceOptions.find((option) => option.value === value);
};
