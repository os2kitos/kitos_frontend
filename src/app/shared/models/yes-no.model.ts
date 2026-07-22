import { APIYesNoUndecidedChoice } from 'src/app/api/v2';

export interface YesNoOption {
  name: string;
  value: APIYesNoUndecidedChoice;
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

export const mapToYesNoEnum = (value?: APIYesNoUndecidedChoice): YesNoOption | undefined => {
  return yesNoOptions.find((option) => option.value === value);
};
