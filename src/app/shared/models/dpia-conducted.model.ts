import { APIDpiaConductedChoice } from 'src/app/api/v2';

export interface DpiaConductedOption {
  name: string;
  value: APIDpiaConductedChoice | string;
}

export enum DpiaConductedEnum {
  Yes = 'Yes',
  No = 'No',
  NoMustBePrepared = 'NoMustBePrepared',
  NoMustNotBePrepared = 'NoMustNotBePrepared',
  DontKnow = 'DontKnow',
  Undecided = 'Undecided',
}

export const dpiaConductedOptions: DpiaConductedOption[] = [
  { name: $localize`Ja`, value: DpiaConductedEnum.Yes },
  { name: $localize`Nej`, value: DpiaConductedEnum.No },
  { name: $localize`Nej, skal udarbejdes`, value: DpiaConductedEnum.NoMustBePrepared },
  { name: $localize`Nej, skal ikke udarbejdes`, value: DpiaConductedEnum.NoMustNotBePrepared },
  { name: $localize`Ved ikke`, value: DpiaConductedEnum.DontKnow },
];
export const mapToDpiaConductedEnum = (value?: APIDpiaConductedChoice): DpiaConductedOption | undefined => {
  return dpiaConductedOptions.find((option) => option.value === value);
};

export const mapFromCapitalizedStringToDpiaConductedEnum = (value?: string): DpiaConductedOption | undefined => {
  const enumValue = fromCapitalizedString(value);
  return dpiaConductedOptions.find((option) => option.value === enumValue);
};

function fromCapitalizedString(value?: string): DpiaConductedEnum {
  switch (value?.toUpperCase()) {
    case 'YES':
      return DpiaConductedEnum.Yes;
    case 'NO':
      return DpiaConductedEnum.No;
    case 'NOMUSTBEPREPARED':
      return DpiaConductedEnum.NoMustBePrepared;
    case 'NOMUSTNOTBEPREPARED':
      return DpiaConductedEnum.NoMustNotBePrepared;
    case 'DONTKNOW':
      return DpiaConductedEnum.DontKnow;
    case undefined:
    case 'UNDECIDED':
      return DpiaConductedEnum.Undecided;
    default:
      throw new Error(`Unknown value for conversion into API yes/no/dont-know/undecided enum: ${value}`);
  }
}
