import { APIGDPRRegistrationsResponseDTO } from 'src/app/api/v2';

export interface RiskAssessmentResultOptions {
  name: string;
  value: APIGDPRRegistrationsResponseDTO.RiskAssessmentResultEnum;
}

export const riskAssessmentResultOptions: RiskAssessmentResultOptions[] = [
  { name: $localize`Lav risiko`, value: APIGDPRRegistrationsResponseDTO.RiskAssessmentResultEnum.Low },
  { name: $localize`Mellem risiko`, value: APIGDPRRegistrationsResponseDTO.RiskAssessmentResultEnum.Medium },
  { name: $localize`Høj risiko`, value: APIGDPRRegistrationsResponseDTO.RiskAssessmentResultEnum.High },
];

export const mapToYesNoDontKnowEnum = (
  value?: APIGDPRRegistrationsResponseDTO.RiskAssessmentResultEnum
): RiskAssessmentResultOptions | undefined => {
  return riskAssessmentResultOptions.find((option) => option.value === value);
};
