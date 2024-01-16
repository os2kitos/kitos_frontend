import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';

export interface HostedAt {
  name: string,
  value: APIGDPRRegistrationsResponseDTO.HostedAtEnum
}

export const hostedAtOptions: HostedAt[] = [
  { name: '', value: APIGDPRRegistrationsResponseDTO.HostedAtEnum.Undecided },
  { name: $localize`On-premise`, value: APIGDPRRegistrationsResponseDTO.HostedAtEnum.OnPremise },
  { name: $localize`Eksternt`, value: APIGDPRRegistrationsResponseDTO.HostedAtEnum.External },
]
