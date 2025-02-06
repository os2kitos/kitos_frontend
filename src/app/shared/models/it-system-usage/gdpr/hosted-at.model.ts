import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';

export interface HostedAt {
  name: string;
  value: APIGDPRRegistrationsResponseDTO.HostedAtEnum | string;
}

export const hostedAtOptions: HostedAt[] = [
  { name: $localize`On-premise`, value: APIGDPRRegistrationsResponseDTO.HostedAtEnum.OnPremise },
  { name: $localize`Eksternt`, value: APIGDPRRegistrationsResponseDTO.HostedAtEnum.External },
];

export const mapHostedAt = (value?: APIGDPRRegistrationsResponseDTO.HostedAtEnum): HostedAt | undefined => {
  return hostedAtOptions.find((option) => option.value === value);
};

export const hostedAtOptionsGrid: HostedAt[] = [
  { name: $localize`On-premise`, value: 'ONPREMISE' },
  { name: $localize`Eksternt`, value: 'EXTERNAL' },
];

export const mapGridHostedAt = (value?: APIGDPRRegistrationsResponseDTO.HostedAtEnum): HostedAt | undefined => {
  return hostedAtOptionsGrid.find((option) => option.value === value);
};
