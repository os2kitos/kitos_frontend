import { APIUserResponseDTO } from 'src/app/api/v2';

export interface StartPreferenceChoice {
  name: string;
  value: APIUserResponseDTO.DefaultUserStartPreferenceEnum;
}

export const startPreferenceChoiceOptions: StartPreferenceChoice[] = [
  {
    name: $localize`Start side`,
    value: APIUserResponseDTO.DefaultUserStartPreferenceEnum.StartSite,
  },
  {
    name: $localize`Organisation`,
    value: APIUserResponseDTO.DefaultUserStartPreferenceEnum.Organization,
  },
  {
    name: $localize`IT Systemer`,
    value: APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItSystemUsage,
  },
  {
    name: $localize`IT Systemkatalog`,
    value: APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItSystemCatalog,
  },
  {
    name: $localize`IT Kontrakter`,
    value: APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItContract,
  },
  {
    name: $localize`Databehandling`,
    value: APIUserResponseDTO.DefaultUserStartPreferenceEnum.DataProcessing,
    },
];

export const mapStartPreferenceChoice = (
  value?: APIUserResponseDTO.DefaultUserStartPreferenceEnum
): StartPreferenceChoice | undefined => {
  return startPreferenceChoiceOptions.find((option) => option.value === value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapStartPreferenceChoiceRaw = (value: any): StartPreferenceChoice | undefined => {
  switch (value) {
    case 'index':
      return startPreferenceChoiceOptions[0];
    case 'organization.structure':
      return startPreferenceChoiceOptions[1];
    case 'it-system.overview':
      return startPreferenceChoiceOptions[2];
    case 'it-system.catalog':
      return startPreferenceChoiceOptions[3];
    case 'it-contract.overview':
      return startPreferenceChoiceOptions[4];
    case 'data-processing.overview':
      return startPreferenceChoiceOptions[5];
    default:
      return undefined;
  }
};
