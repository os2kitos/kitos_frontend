import { APIItContractSupplierTypeChoice } from 'src/app/api/v2/model/models';

export interface ITContractSupplierType {
  name: string;
  value: APIItContractSupplierTypeChoice;
}

export const itContractSupplierTypeOptions: ITContractSupplierType[] = [
  { name: $localize`Intern`, value: APIItContractSupplierTypeChoice.Internal },
  { name: $localize`Ekstern`, value: APIItContractSupplierTypeChoice.External },
];

export const mapITContractSupplierType = (
  value?: APIItContractSupplierTypeChoice,
): ITContractSupplierType | undefined => {
  return itContractSupplierTypeOptions.find((option) => option.value === value);
};
