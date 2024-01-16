import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';

export interface BusinessCriticalSystem {
  name: string;
  value: APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum
}

export const businessCriticalSystemOptions: BusinessCriticalSystem[] = [
  { name: '', value: APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum.Undecided },
  { name: $localize`Ja`, value: APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum.Yes },
  { name: $localize`Nej`, value: APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum.No },
  { name: $localize`Ved ikke`, value: APIGDPRRegistrationsResponseDTO.BusinessCriticalEnum.DontKnow },
];
