import { APIYesNoUndecidedChoice } from 'src/app/api/v2';

export interface IsOversightCompleted {
  name: string;
  value: APIYesNoUndecidedChoice;
}

export const isOversightCompletedOptions: IsOversightCompleted[] = [
  {
    name: $localize`Ja`,
    value: APIYesNoUndecidedChoice.Yes,
  },
  {
    name: $localize`Nej`,
    value: APIYesNoUndecidedChoice.No,
  },
  {
    name: '',
    value: APIYesNoUndecidedChoice.Undecided,
  },
];

export const mapIsOversightCompleted = (source?: APIYesNoUndecidedChoice): IsOversightCompleted | undefined => {
  return isOversightCompletedOptions.find((option) => option.value === source);
};
