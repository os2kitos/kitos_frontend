import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';

export interface YesNoDontKnowOptions {
  name: string;
  value: APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum | APIGDPRRegistrationsResponseDTO.UserSupervisionEnum;
}

export enum YesNoDontKnowEnum {
  Yes = 'Yes',
  No = 'No',
  DontKnow = 'DontKnow',
  Undecided = 'Undecided',
}

export const yesNoDontKnowOptions: YesNoDontKnowOptions[] = [
  { name: $localize`Ja`, value: YesNoDontKnowEnum.Yes },
  { name: $localize`Nej`, value: YesNoDontKnowEnum.No },
  { name: $localize`Ved ikke`, value: YesNoDontKnowEnum.DontKnow },
];

export const mapToYesNoDontKnowEnum = (
  value?:
    | APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum
    | APIGDPRRegistrationsResponseDTO.UserSupervisionEnum
    | APIGDPRRegistrationsResponseDTO.DpiaConductedEnum
): YesNoDontKnowOptions | undefined => {
  return yesNoDontKnowOptions.find((option) => option.value === value);
};
