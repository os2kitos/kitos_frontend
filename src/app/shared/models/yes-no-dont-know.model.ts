import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';

export interface YesNoDontKnowOption {
  name: string;
  value:
    | APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum
    | APIGDPRRegistrationsResponseDTO.UserSupervisionEnum
    | string;
}

export enum YesNoDontKnowEnum {
  Yes = 'Yes',
  No = 'No',
  DontKnow = 'DontKnow',
  Undecided = 'Undecided',
}

export const yesNoDontKnowOptions: YesNoDontKnowOption[] = [
  { name: $localize`Ja`, value: YesNoDontKnowEnum.Yes },
  { name: $localize`Nej`, value: YesNoDontKnowEnum.No },
  { name: $localize`Ved ikke`, value: YesNoDontKnowEnum.DontKnow },
];
export const mapToYesNoDontKnowEnum = (
  value?:
    | APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum
    | APIGDPRRegistrationsResponseDTO.UserSupervisionEnum
    | APIGDPRRegistrationsResponseDTO.DpiaConductedEnum,
): YesNoDontKnowOption | undefined => {
  return yesNoDontKnowOptions.find((option) => option.value === value);
};

export const mapFromCapitalizedStringToYesNoDontKnowEnum = (value?: string): YesNoDontKnowOption | undefined => {
  const enumValue = fromCapitalizedString(value);
  return yesNoDontKnowOptions.find((option) => option.value === enumValue);
};

function fromCapitalizedString(value?: string): YesNoDontKnowEnum {
  switch (value) {
    case 'YES':
      return YesNoDontKnowEnum.Yes;
    case 'NO':
      return YesNoDontKnowEnum.No;
    case 'DONTKNOW':
      return YesNoDontKnowEnum.DontKnow;
    case null:
    case undefined:
    case 'UNDECIDED':
      return YesNoDontKnowEnum.Undecided;
    default:
      throw new Error(`Unknown value for conversion into API yes/no/dont-know/undecided enum: ${value}`);
  }
}
