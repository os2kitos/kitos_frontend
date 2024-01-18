import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';

export interface BusinessCritical {
  name: string;
  value: APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum
}

export const businessCriticalOptions: BusinessCritical[] = [
  { name: '', value: APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum.Undecided },
  { name: $localize`Ja`, value: APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum.Yes },
  { name: $localize`Nej`, value: APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum.No },
  { name: $localize`Ved ikke`, value: APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum.DontKnow },
];

export const mapBusinessCritical = (
  value?: APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum
): BusinessCritical | undefined => {
  return businessCriticalOptions.find((option) => option.value == value)
}
