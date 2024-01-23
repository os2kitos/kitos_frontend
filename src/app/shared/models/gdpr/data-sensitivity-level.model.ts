import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';

export interface DataSensitivityLevel {
  name: string,
  value: APIGDPRRegistrationsResponseDTO.DataSensitivityLevelsEnum
}

export const dataSensitivityLevelOptions: DataSensitivityLevel[] = [
  { name: $localize`Ingen personoplysninger`, value: APIGDPRRegistrationsResponseDTO.DataSensitivityLevelsEnum.None },
  { name: $localize`Almindelige personoplysninger`, value: APIGDPRRegistrationsResponseDTO.DataSensitivityLevelsEnum.PersonData },
  { name: $localize`Følsomme personoplysninger`, value: APIGDPRRegistrationsResponseDTO.DataSensitivityLevelsEnum.SensitiveData },
  { name: $localize`Straffedomme og lovovertrædelser`, value: APIGDPRRegistrationsResponseDTO.DataSensitivityLevelsEnum.LegalData },
]

export const mapDataSensitivityLevel = (
  value?: APIGDPRRegistrationsResponseDTO.DataSensitivityLevelsEnum
): DataSensitivityLevel | undefined => {
  return dataSensitivityLevelOptions.find((option) => option.value === value)
}
