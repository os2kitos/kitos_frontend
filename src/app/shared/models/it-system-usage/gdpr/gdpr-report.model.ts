import { APIGdprReportResponseDTO } from 'src/app/api/v2';
import { mapToYesNoDontKnowIrrelevantEnum } from '../../yes-no-dont-know-irrelevant.model';
import { mapToYesNoDontKnowEnum, YesNoDontKnowOption } from '../../yes-no-dont-know.model';
import { HostedAt, mapHostedAt } from './hosted-at.model';
import { mapPreRiskAssessmentEnum, PreRiskAssessment } from './pre-risk-assessment.model';

export interface GdprReport {
  systemUuid: string;
  systemName?: string;
  noData?: boolean;
  personalData?: boolean;
  sensitiveData?: boolean;
  legalData?: boolean;
  dataProcessingAgreementConcluded?: boolean;
  linkToDirectory?: boolean;
  sensitiveDataTypes: string;
  riskAssessment?: YesNoDontKnowOption;
  riskAssessmentDate?: string;
  plannedRiskAssessmentDate?: string;
  preRiskAssessment?: PreRiskAssessment;
  riskAssessmentNotes?: string;
  personalDataCpr?: boolean;
  personalDataSocialProblems?: boolean;
  personalDataSocialOtherPrivateMatters?: boolean;
  dpia?: YesNoDontKnowOption;
  dpiaDate?: string;
  hostedAt?: HostedAt;
  technicalSupervisionDocumentationUrl?: string;
  technicalSupervisionDocumentationUrlName?: string;
  userSupervision?: YesNoDontKnowOption;
  userSupervisionDocumentationUrl?: string;
  userSupervisionDocumentationUrlName?: string;
  nextDataRetentionEvaluationDate?: string;
  insecureCountriesSubjectToDataTransfer: string;
}

export function adaptGdprReport(dto: APIGdprReportResponseDTO): GdprReport {
  if (!dto.systemUuid) throw new Error('GDPR Report is missing a systemUuid');
  return {
    systemUuid: dto.systemUuid,
    systemName: dto.systemName ?? undefined,
    noData: dto.noData,
    personalData: dto.personalData,
    sensitiveData: dto.sensitiveData,
    legalData: dto.legalData,
    dataProcessingAgreementConcluded: dto.dataProcessingAgreementConcluded,
    linkToDirectory: dto.linkToDirectory,
    sensitiveDataTypes: dto.sensitiveDataTypes?.join(', ') ?? '',
    riskAssessment: mapToYesNoDontKnowIrrelevantEnum(dto.riskAssessment),
    riskAssessmentDate: dto.riskAssessmentDate ?? undefined,
    plannedRiskAssessmentDate: dto.plannedRiskAssessmentDate ?? undefined,
    preRiskAssessment: mapPreRiskAssessmentEnum(dto.preRiskAssessment ?? undefined),
    riskAssessmentNotes: dto.riskAssessmentNotes ?? undefined,
    personalDataCpr: dto.personalDataCpr,
    personalDataSocialProblems: dto.personalDataSocialProblems,
    personalDataSocialOtherPrivateMatters: dto.personalDataSocialOtherPrivateMatters,
    dpia: mapToYesNoDontKnowEnum(dto.dpia),
    dpiaDate: dto.dpiaDate ?? undefined,
    hostedAt: mapHostedAt(dto.hostedAt ?? undefined),
    technicalSupervisionDocumentationUrl: dto.technicalSupervisionDocumentationUrl ?? undefined,
    technicalSupervisionDocumentationUrlName: dto.technicalSupervisionDocumentationUrlName ?? undefined,
    userSupervision: mapToYesNoDontKnowEnum(dto.userSupervision),
    userSupervisionDocumentationUrl: dto.userSupervisionDocumentationUrl ?? undefined,
    userSupervisionDocumentationUrlName: dto.userSupervisionDocumentationUrlName ?? undefined,
    nextDataRetentionEvaluationDate: dto.nextDataRetentionEvaluationDate ?? undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    insecureCountriesSubjectToDataTransfer: (dto as any).insecureCountriesSubjectToDataTransfer.join(', ') ?? '',
  };
}
