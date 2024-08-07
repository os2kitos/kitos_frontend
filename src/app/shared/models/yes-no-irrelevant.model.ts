import { APIDataProcessingRegistrationGeneralDataResponseDTO } from 'src/app/api/v2';

export interface YesNoIrrelevantOptions {
  name: string;
  value: APIDataProcessingRegistrationGeneralDataResponseDTO.IsAgreementConcludedEnum | string;
}

export enum YesNoIrrelevantEnum {
  Yes = 'Yes',
  No = 'No',
  Irrelevant = 'Irrelevant',
  Undecided = 'Undecided',
}

export const yesNoIrrelevantOptions: YesNoIrrelevantOptions[] = [
  { name: $localize`Ja`, value: YesNoIrrelevantEnum.Yes },
  { name: $localize`Nej`, value: YesNoIrrelevantEnum.No },
  { name: $localize`Ved ikke`, value: YesNoIrrelevantEnum.Irrelevant },
];

export const yesNoIrrelevantOptionsGrid: YesNoIrrelevantOptions[] = [
  { name: $localize`Ja`, value: 'Ja' },
  { name: $localize`Nej`, value: 'Nej' },
  { name: $localize`Ved ikke`, value: 'Ikke relevant' },
];

export const mapToYesNoIrrelevantEnum = (
  value?: APIDataProcessingRegistrationGeneralDataResponseDTO.IsAgreementConcludedEnum
): YesNoIrrelevantOptions | undefined => {
  return yesNoIrrelevantOptions.find((option) => option.value === value);
};

export const mapToYesNoIrrelevantEnumGrid = (
  value?: APIDataProcessingRegistrationGeneralDataResponseDTO.IsAgreementConcludedEnum
): YesNoIrrelevantOptions | undefined => {
  return yesNoIrrelevantOptionsGrid.find((option) => option.value === value);
};
