import { APIIsDataProcessingAgreementRequiredChoice } from 'src/app/api/v2';

export interface IsDataProcessingAgreementRequired {
  name: string;
  value: APIIsDataProcessingAgreementRequiredChoice | string;
}

export const isDataProcessingAgreementRequiredOptions: IsDataProcessingAgreementRequired[] = [
  { name: $localize`Ja`, value: APIIsDataProcessingAgreementRequiredChoice.Yes },
  { name: $localize`Nej`, value: APIIsDataProcessingAgreementRequiredChoice.No },
  { name: $localize`Styret via lovgivning`, value: APIIsDataProcessingAgreementRequiredChoice.DecidedByLaw },
];

export const mapIsDataProcessingAgreementRequired = (
  value?: APIIsDataProcessingAgreementRequiredChoice,
): IsDataProcessingAgreementRequired | undefined => {
  return isDataProcessingAgreementRequiredOptions.find((option) => option.value === value);
};
