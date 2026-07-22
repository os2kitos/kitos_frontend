import { APITechnicalPrecautionChoice } from 'src/app/api/v2';

export interface TechnicalPrecautions {
  name: string;
  value: APITechnicalPrecautionChoice;
}

export const technicalPrecautionsOptions: TechnicalPrecautions[] = [
  { name: $localize`Kryptering`, value: APITechnicalPrecautionChoice.Encryption },
  {
    name: $localize`Pseudonomisering`,
    value: APITechnicalPrecautionChoice.Pseudonymization,
  },
  {
    name: $localize`Adgangsstyring`,
    value: APITechnicalPrecautionChoice.AccessControl,
  },
  { name: $localize`Logning`, value: APITechnicalPrecautionChoice.Logging },
];

export const mapTechnicalPecautions = (value?: APITechnicalPrecautionChoice): TechnicalPrecautions | undefined => {
  return technicalPrecautionsOptions.find((option) => option.value === value);
};
