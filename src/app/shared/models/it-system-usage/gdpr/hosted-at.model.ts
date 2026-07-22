import { APIHostingChoice } from 'src/app/api/v2';

export interface HostedAt {
  name: string;
  value: APIHostingChoice | string;
}

export const hostedAtOptions: HostedAt[] = [
  { name: $localize`On-premise`, value: APIHostingChoice.OnPremise },
  { name: $localize`Eksternt`, value: APIHostingChoice.External },
  { name: $localize`Hybrid`, value: APIHostingChoice.Hybrid },
];

export const mapHostedAt = (value?: APIHostingChoice): HostedAt | undefined => {
  return hostedAtOptions.find((option) => option.value === value);
};

export const hostedAtOptionsGrid: HostedAt[] = [
  { name: $localize`On-premise`, value: 'ONPREMISE' },
  { name: $localize`Eksternt`, value: 'EXTERNAL' },
  { name: $localize`Hybrid`, value: 'HYBRID' },
];

export const mapGridHostedAt = (value?: APIHostingChoice): HostedAt | undefined => {
  return hostedAtOptionsGrid.find((option) => option.value === value);
};
