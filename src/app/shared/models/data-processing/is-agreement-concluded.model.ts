import { APIYesNoIrrelevantOption } from 'src/app/api/v1';

export interface IsAgreementConcluded {
  name: string;
  value: APIYesNoIrrelevantOption;
}

export const isAgreementConcludedOptions: IsAgreementConcluded[] = [
  {
    name: $localize`Ja`,
    value: APIYesNoIrrelevantOption.Yes,
  },
  {
    name: $localize`Nej`,
    value: APIYesNoIrrelevantOption.No,
  },
  {
    name: $localize`Ikke relevant`,
    value: APIYesNoIrrelevantOption.Irrelevant,
  },
  {
    name: '',
    value: APIYesNoIrrelevantOption.Undecided,
  },
];

export const mapIsAgreementConcluded = (source?: APIYesNoIrrelevantOption): IsAgreementConcluded | undefined => {
  return isAgreementConcludedOptions.find((option) => option.value === source);
};
