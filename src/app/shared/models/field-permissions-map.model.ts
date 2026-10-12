export const fieldPermissionsMap = {
  IsOversightCompleted: 'DataProcessingRegistration.IsOversightCompleted',
  oversightDates: {
    oversightDate: 'DataProcessingRegistrationOversightDate.OversightDate',
    oversightRemark: 'DataProcessingRegistrationOversightDate.OversightRemark',
    oversightReportLink: {
      name: 'DataProcessingRegistrationOversightDate.OversightReportLinkName',
      url: 'DataProcessingRegistrationOversightDate.OversightReportLink',
    },
    oversightOption: 'DataProcessingRegistrationOversightDate.OversightOptionId',
  },
};

export const itSystemUsageFields = {
  containsAITechnology: 'ItSystemUsage.ContainsAITechnology',
  systemUsageCriticalityLevel: 'ItSystemUsage.SystemUsageCriticalityLevel',
  gdpr: {
    //Foretaget risikovurdering
    riskAssessment: 'ItSystemUsage.riskAssessment',
    //Hvad viste den seneste risikovurdering?
    preriskAssessment: 'ItSystemUsage.preriskAssessment',
  },
};

const oversightLabelByKey: Record<string, string> = {
  'DataProcessingRegistration.IsOversightCompleted': $localize`Gennemførte og kommende tilsyn`,
  'DataProcessingRegistrationOversightDate.OversightDate': $localize`Dato for tilsyn`,
  'DataProcessingRegistrationOversightDate.OversightRemark': $localize`Tilsyn bemærkninger`,
  'DataProcessingRegistrationOversightDate.OversightReportLinkName': $localize`Tilsyn rapport link navn`,
  'DataProcessingRegistrationOversightDate.OversightReportLink': $localize`Tilsyn rapport link`,
  'DataProcessingRegistrationOversightDate.OversightOptionId': $localize`Tilsynmulighed`,
  'ItSystemUsage.ContainsAITechnology': $localize`Indeholder AI-teknologi?`,
  'ItSystemUsage.SystemUsageCriticalityLevel': $localize`Kritikalitet`,
  'ItSystemUsage.riskAssessment': $localize`GDPR Foretaget risikovurdering`,
  'ItSystemUsage.preriskAssessment': $localize`GDPR Hvad viste den seneste risikovurdering?`,
};

export const getLabelFromFieldKey = (key: string | null): string => oversightLabelByKey[key ?? ''] ?? key ?? '';
