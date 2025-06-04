import { APIGeneralDataResponseDTO } from 'src/app/api/v2';

export interface YesNoPartiallyOption {
  name: string;
  value: YesNoPartiallyEnum;
}

export enum YesNoPartiallyEnum {
  Yes = 'Yes',
  No = 'No',
  Partially = 'Partially',
}

export const yesNoPartiallyOptions: YesNoPartiallyOption[] = [
  { name: $localize`Ja`, value: YesNoPartiallyEnum.Yes },
  { name: $localize`Nej`, value: YesNoPartiallyEnum.No },
  { name: $localize`Delvist`, value: YesNoPartiallyEnum.Partially },
];

export function mapToYesNoPartiallyEnum(
  value: APIGeneralDataResponseDTO.WebAccessibilityComplianceEnum | undefined,
): YesNoPartiallyOption | undefined {
  return yesNoPartiallyOptions.find((option) => option.value === value);
}
