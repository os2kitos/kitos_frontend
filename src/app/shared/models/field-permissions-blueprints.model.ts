export const dataProcessingFields = {
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
  containsAITechnology: 'ITSystemUsage.ContainsAITechnology',
  systemUsageCriticalityLevel: 'ITSystemUsage.SystemUsageCriticalityLevel',
  gdpr: {
    riskAssessment: 'ItSystemUsage.preriskAssessment',
  },
};
