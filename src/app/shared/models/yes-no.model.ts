import { APIDataProcessingRegistrationGeneralDataResponseDTO } from 'src/app/api/v2';

export interface YesNoOptions {
  name: string;
  value: APIDataProcessingRegistrationGeneralDataResponseDTO.TransferToInsecureThirdCountriesEnum;
}

export enum YesNoEnum {
  Yes = 'Yes',
  No = 'No',
  Undecided = 'Undecided',
}

export const yesNoOptions: YesNoOptions[] = [
  { name: $localize`Ja`, value: YesNoEnum.Yes },
  { name: $localize`Nej`, value: YesNoEnum.No },
];

export const mapToYesNoEnum = (
  value?: APIDataProcessingRegistrationGeneralDataResponseDTO.TransferToInsecureThirdCountriesEnum
): YesNoOptions | undefined => {
  return yesNoOptions.find((option) => option.value === value);
};
