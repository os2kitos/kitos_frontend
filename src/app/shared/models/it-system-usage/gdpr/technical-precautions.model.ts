import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';

export interface TechnicalPrecautionsOptions {
  name: string;
  value: APIGDPRRegistrationsResponseDTO.TechnicalPrecautionsAppliedEnum;
}

export const technicalPrecautionsOptions: TechnicalPrecautionsOptions[] = [
  { name: $localize`Kryptering`, value: APIGDPRRegistrationsResponseDTO.TechnicalPrecautionsAppliedEnum.Encryption },
  {
    name: $localize`Pseudonomisering`,
    value: APIGDPRRegistrationsResponseDTO.TechnicalPrecautionsAppliedEnum.Pseudonymization,
  },
  {
    name: $localize`Adgangsstyring`,
    value: APIGDPRRegistrationsResponseDTO.TechnicalPrecautionsAppliedEnum.AccessControl,
  },
  { name: $localize`Logning`, value: APIGDPRRegistrationsResponseDTO.TechnicalPrecautionsAppliedEnum.Logging },
];

export const mapTechnicalPecautions = (
  value?: APIGDPRRegistrationsResponseDTO.TechnicalPrecautionsAppliedEnum
): TechnicalPrecautionsOptions | undefined => {
  return technicalPrecautionsOptions.find((option) => option.value === value);
};
