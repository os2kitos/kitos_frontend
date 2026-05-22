import { APIRiskLevelChoice } from 'src/app/api/v2';

export interface RiskAssessmentResultOptions {
  name: string;
  value: APIRiskLevelChoice;
}

export interface RiskAssessmentResultGridOptions {
  name: string;
  value: string;
}

export const riskAssessmentResultOptions: RiskAssessmentResultOptions[] = [
  { name: $localize`Lav risiko`, value: APIRiskLevelChoice.Low },
  { name: $localize`Mellem risiko`, value: APIRiskLevelChoice.Medium },
  { name: $localize`Høj risiko`, value: APIRiskLevelChoice.High },
];

export const riskAssessmentResultOptionsGrid: RiskAssessmentResultGridOptions[] = [
  { name: $localize`Lav risiko`, value: 'LOW' },
  { name: $localize`Mellem risiko`, value: 'MIDDLE' },
  { name: $localize`Høj risiko`, value: 'HIGH' },
];

export const mapRiskAssessmentEnum = (value?: APIRiskLevelChoice): RiskAssessmentResultOptions | undefined => {
  return riskAssessmentResultOptions.find((option) => option.value === value);
};

export const mapGridRiskAssessmentEnum = (value?: string): RiskAssessmentResultGridOptions | undefined => {
  return riskAssessmentResultOptionsGrid.find((option) => option.value === value);
};
