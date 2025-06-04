import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';

export interface HostedAt {
  name: string;
  value: APIGDPRRegistrationsResponseDTO.HostedAtEnum | string;
}

export const hostedAtOptions: HostedAt[] = [
  { name: $localize`On-premise`, value: APIGDPRRegistrationsResponseDTO.HostedAtEnum.OnPremise },
  { name: $localize`Eksternt`, value: APIGDPRRegistrationsResponseDTO.HostedAtEnum.External },
  { name: $localize`Hybrid`, value: APIGDPRRegistrationsResponseDTO.HostedAtEnum.Hybrid },
];

export const mapHostedAt = (value?: APIGDPRRegistrationsResponseDTO.HostedAtEnum): HostedAt | undefined => {
  return hostedAtOptions.find((option) => option.value === value);
};

export const hostedAtOptionsGrid: HostedAt[] = [
  { name: $localize`On-premise`, value: 'ONPREMISE' },
  { name: $localize`Eksternt`, value: 'EXTERNAL' },
  { name: $localize`Hybrid`, value: 'HYBRID' },
];

export const mapGridHostedAt = (value?: APIGDPRRegistrationsResponseDTO.HostedAtEnum): HostedAt | undefined => {
  return hostedAtOptionsGrid.find((option) => option.value === value);
};
