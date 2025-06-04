import { APIDataProcessingRegistrationGeneralDataResponseDTO } from 'src/app/api/v2';

export interface YesNoOption {
  name: string;
  value: APIDataProcessingRegistrationGeneralDataResponseDTO.TransferToInsecureThirdCountriesEnum;
}

export enum YesNoEnum {
  Yes = 'Yes',
  No = 'No',
  Undecided = 'Undecided',
}

export const yesNoOptions: YesNoOption[] = [
  { name: $localize`Ja`, value: YesNoEnum.Yes },
  { name: $localize`Nej`, value: YesNoEnum.No },
];

export const mapToYesNoEnum = (
  value?: APIDataProcessingRegistrationGeneralDataResponseDTO.TransferToInsecureThirdCountriesEnum,
): YesNoOption | undefined => {
  return yesNoOptions.find((option) => option.value === value);
};
