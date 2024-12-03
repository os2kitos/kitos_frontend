import { APIGdprReportResponseDTO } from 'src/app/api/v2';

export interface PreRiskAssessment {
  name: string;
  value: APIGdprReportResponseDTO.PreRiskAssessmentEnum;
}

export const riskAssessmentResultOptions: PreRiskAssessment[] = [
  { name: $localize`Ved ikke`, value: APIGdprReportResponseDTO.PreRiskAssessmentEnum.Undecided },
  { name: $localize`Lav risiko`, value: APIGdprReportResponseDTO.PreRiskAssessmentEnum.Low },
  { name: $localize`Mellem risiko`, value: APIGdprReportResponseDTO.PreRiskAssessmentEnum.Medium },
  { name: $localize`Høj risiko`, value: APIGdprReportResponseDTO.PreRiskAssessmentEnum.High },
];

export const mapPreRiskAssessmentEnum = (
  value?: APIGdprReportResponseDTO.PreRiskAssessmentEnum
): PreRiskAssessment | undefined => {
  return riskAssessmentResultOptions.find((option) => option.value === value);
};
