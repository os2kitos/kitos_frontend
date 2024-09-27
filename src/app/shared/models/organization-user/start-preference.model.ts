import { APIUserResponseDTO } from 'src/app/api/v2';

export interface StartPreferenceChoice {
  name: string;
  value: APIUserResponseDTO.DefaultUserStartPreferenceEnum;
}

export const startPereferenceChoiceOptions: StartPreferenceChoice[] = [
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
    value: APIUserResponseDTO.DefaultUserStartPreferenceEnum.ItContract,
  },
];

export const mapStartPreferenceChoice = (
  value?: APIUserResponseDTO.DefaultUserStartPreferenceEnum
): StartPreferenceChoice | undefined => {
  return startPereferenceChoiceOptions.find((option) => option.value === value);
};
