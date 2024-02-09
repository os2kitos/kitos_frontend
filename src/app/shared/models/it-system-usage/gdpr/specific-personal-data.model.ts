import { APIGDPRRegistrationsResponseDTO } from "src/app/api/v2";

export interface SpecificPersonalData {
  name: string,
  value: APIGDPRRegistrationsResponseDTO.SpecificPersonalDataEnum
}

export const specificPersonalDataOptions: SpecificPersonalData[] = [
  { name: 'CprNumber', value: APIGDPRRegistrationsResponseDTO.SpecificPersonalDataEnum.CprNumber },
  { name: 'SocialProblems', value: APIGDPRRegistrationsResponseDTO.SpecificPersonalDataEnum.SocialProblems },
  { name: 'OtherPrivateMatters', value: APIGDPRRegistrationsResponseDTO.SpecificPersonalDataEnum.OtherPrivateMatters }
]

export const mapSpecificPersonalData = (
  value?: APIGDPRRegistrationsResponseDTO.SpecificPersonalDataEnum
): SpecificPersonalData | undefined => {
  return specificPersonalDataOptions.find((option) => option.value === value)
}
