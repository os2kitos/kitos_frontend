import { APIDefaultUserStartPreferenceChoice } from 'src/app/api/v2';

export interface StartPreferenceChoice {
  name: string;
  value: APIDefaultUserStartPreferenceChoice;
}

export const startPreferenceChoiceOptions: StartPreferenceChoice[] = [
  {
    name: $localize`Start side`,
    value: APIDefaultUserStartPreferenceChoice.StartSite,
  },
  {
    name: $localize`Organisation`,
    value: APIDefaultUserStartPreferenceChoice.Organization,
  },
  {
    name: $localize`IT Systemer`,
    value: APIDefaultUserStartPreferenceChoice.ItSystemUsage,
  },
  {
    name: $localize`IT Systemkatalog`,
    value: APIDefaultUserStartPreferenceChoice.ItSystemCatalog,
  },
  {
    name: $localize`IT Kontrakter`,
    value: APIDefaultUserStartPreferenceChoice.ItContract,
  },
  {
    name: $localize`Databehandling`,
    value: APIDefaultUserStartPreferenceChoice.DataProcessing,
  },
];

export const mapStartPreferenceChoice = (
  value?: APIDefaultUserStartPreferenceChoice,
): StartPreferenceChoice | undefined => {
  return startPreferenceChoiceOptions.find((option) => option.value === value);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapStartPreferenceChoiceFromV1 = (value: any): StartPreferenceChoice | undefined => {
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
