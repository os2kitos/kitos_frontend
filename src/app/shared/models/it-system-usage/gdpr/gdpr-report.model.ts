import { APIGdprReportResponseDTO } from 'src/app/api/v2';
import { mapToYesNoDontKnowEnum, YesNoDontKnowOptions } from '../../yes-no-dont-know.model';
import { HostedAt, mapHostedAt } from './hosted-at.model';
import { mapPreRiskAssessmentEnum, PreRiskAssessment } from './pre-risk-assessment.model';

export interface GdprReport {
  systemUuid: string;
  systemName?: string;
  noData?: boolean;
  personalData?: boolean;
  sensitiveData?: boolean;
  legalData?: boolean;
  businessCritical?: YesNoDontKnowOptions;
  dataProcessingAgreementConcluded?: boolean;
  linkToDirectory?: boolean;
  sensitiveDataTypes: string;
  riskAssessment?: YesNoDontKnowOptions;
  riskAssessmentDate?: string;
  plannedRiskAssessmentDate?: string;
  preRiskAssessment?: PreRiskAssessment;
  personalDataCpr?: boolean;
  personalDataSocialProblems?: boolean;
  personalDataSocialOtherPrivateMatters?: boolean;
  dpia?: YesNoDontKnowOptions;
  hostedAt?: HostedAt;
}

export function adaptGdprReport(dto: APIGdprReportResponseDTO): GdprReport {
  if (!dto.systemUuid) throw new Error('GDPR Report is missing a systemUuid');
  return {
    systemUuid: dto.systemUuid,
    systemName: dto.systemName,
    noData: dto.noData,
    personalData: dto.personalData,
    sensitiveData: dto.sensitiveData,
    legalData: dto.legalData,
    businessCritical: mapToYesNoDontKnowEnum(dto.businessCritical),
    dataProcessingAgreementConcluded: dto.dataProcessingAgreementConcluded,
    linkToDirectory: dto.linkToDirectory,
    sensitiveDataTypes: dto.sensitiveDataTypes?.join(', ') ?? '',
    riskAssessment: mapToYesNoDontKnowEnum(dto.riskAssessment),
    riskAssessmentDate: dto.riskAssessmentDate,
    plannedRiskAssessmentDate: dto.plannedRiskAssessmentDate,
    preRiskAssessment: mapPreRiskAssessmentEnum(dto.preRiskAssessment),
    personalDataCpr: dto.personalDataCpr,
    personalDataSocialProblems: dto.personalDataSocialProblems,
    personalDataSocialOtherPrivateMatters: dto.personalDataSocialOtherPrivateMatters,
    dpia: mapToYesNoDontKnowEnum(dto.dpia),
    hostedAt: mapHostedAt(dto.hostedAt),
  };
}
