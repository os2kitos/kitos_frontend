import { APIYesNoDontKnowIrrelevantChoice } from 'src/app/api/v2';

export interface YesNoDontKnowIrrelevantOption {
  name: string;
  value: APIYesNoDontKnowIrrelevantChoice | string;
}

export enum YesNoDontKnowIrrelevantEnum {
  Yes = 'Yes',
  No = 'No',
  DontKnow = 'DontKnow',
  Irrelevant = 'Irrelevant',
  Undecided = 'Undecided',
}

export const yesNoDontKnowIrrelevantOptions: YesNoDontKnowIrrelevantOption[] = [
  { name: $localize`Ja`, value: YesNoDontKnowIrrelevantEnum.Yes },
  { name: $localize`Nej`, value: YesNoDontKnowIrrelevantEnum.No },
  { name: $localize`Ved ikke`, value: YesNoDontKnowIrrelevantEnum.DontKnow },
  { name: $localize`Ikke relevant`, value: YesNoDontKnowIrrelevantEnum.Irrelevant },
];

export interface YesNoDontKnowIrrelevantGridOption {
  name: string;
  value: string;
}

export const yesNoDontKnowIrrelevantOptionsGrid: YesNoDontKnowIrrelevantGridOption[] = [
  { name: $localize`Ja`, value: 'YES' },
  { name: $localize`Nej`, value: 'NO' },
  { name: $localize`Ved ikke`, value: 'DONTKNOW' },
  { name: $localize`Ikke relevant`, value: 'IRRELEVANT' },
];

export const mapGridYesNoDontKnowIrrelevantEnum = (value?: string): YesNoDontKnowIrrelevantGridOption | undefined => {
  return yesNoDontKnowIrrelevantOptionsGrid.find((option) => option.value === value);
};

export const mapToYesNoDontKnowIrrelevantEnum = (
  value?: APIYesNoDontKnowIrrelevantChoice,
): YesNoDontKnowIrrelevantOption | undefined => {
  return yesNoDontKnowIrrelevantOptions.find((option) => option.value === value);
};
