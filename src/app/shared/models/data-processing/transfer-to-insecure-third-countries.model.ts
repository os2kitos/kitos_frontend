import { APIYesNoUndecidedChoice } from 'src/app/api/v2';

export interface TransferToInsecureThirdCountries {
  name: string;
  value: APIYesNoUndecidedChoice;
}

export const transferToInsecureThirdCountriesOptions: TransferToInsecureThirdCountries[] = [
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

export const mapTransferToInsecureThirdCountries = (
  source?: APIYesNoUndecidedChoice,
): TransferToInsecureThirdCountries | undefined => {
  return transferToInsecureThirdCountriesOptions.find((option) => option.value === source);
};
