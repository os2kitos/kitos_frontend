import { APIRiskLevelChoice } from 'src/app/api/v2';

export interface PreRiskAssessment {
  name: string;
  value: APIRiskLevelChoice;
}

export const riskAssessmentResultOptions: PreRiskAssessment[] = [
  { name: $localize`Ved ikke`, value: APIRiskLevelChoice.Undecided },
  { name: $localize`Lav risiko`, value: APIRiskLevelChoice.Low },
  { name: $localize`Mellem risiko`, value: APIRiskLevelChoice.Medium },
  { name: $localize`Høj risiko`, value: APIRiskLevelChoice.High },
];

export const mapPreRiskAssessmentEnum = (value?: APIRiskLevelChoice): PreRiskAssessment | undefined => {
  return riskAssessmentResultOptions.find((option) => option.value === value);
};
