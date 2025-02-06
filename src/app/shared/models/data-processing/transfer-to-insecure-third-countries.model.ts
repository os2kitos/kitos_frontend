import { APIDataProcessingRegistrationDTO } from "src/app/api/v1";

export interface TransferToInsecureThirdCountries {
  name: string;
  value: APIDataProcessingRegistrationDTO.TransferToInsecureThirdCountriesEnum;
}

export const transferToInsecureThirdCountriesOptions: TransferToInsecureThirdCountries[] = [
  {
    name: $localize`Ja`,
    value: APIDataProcessingRegistrationDTO.TransferToInsecureThirdCountriesEnum.Yes
  },
  {
    name: $localize`Nej`,
    value: APIDataProcessingRegistrationDTO.TransferToInsecureThirdCountriesEnum.No
  },
  {
    name: '',
    value: APIDataProcessingRegistrationDTO.TransferToInsecureThirdCountriesEnum.Undecided
  }
]

export const mapTransferToInsecureThirdCountries = (
  source?: APIDataProcessingRegistrationDTO.TransferToInsecureThirdCountriesEnum
): TransferToInsecureThirdCountries | undefined => {
  return transferToInsecureThirdCountriesOptions.find((option) => option.value === source)
}
