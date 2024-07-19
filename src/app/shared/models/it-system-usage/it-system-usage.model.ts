import { LifeCycleStatus, mapLifeCycleStatus } from '../life-cycle-status.model';
import { YesNoIrrelevantOptions, mapToYesNoIrrelevantEnum } from '../yes-no-irrelevant.model';
import { ArchiveDutyChoice, mapArchiveDutyChoice } from './archive-duty-choice.model';
import { HostedAt, mapHostedAt } from './gdpr/hosted-at.model';

export interface ITSystemUsage {
  //ngrx requires the id field to have lowercase 'id' name
  id: string;
  ActiveAccordingToValidityPeriod: boolean;
  ActiveAccordingToLifeCycle: boolean;
  MainContractIsActive: boolean;
  LocalSystemId: string;
  ItSystemUuid: string;
  ExternalSystemUuid: string;
  ParentItSystemName: string;
  SystemName: string;
  Version: string;
  LocalCallName: string;
  ResponsibleOrganizationUnitName: string;
  ResponsibleOrganizationUnitUuid: string;
  SystemPreviousName: string;
  ItSystemBusinessTypeId: string;
  ItSystemBusinessTypeName: string;
  ItSystemKLEIdsAsCsv: string;
  ItSystemKLENamesAsCsv: string;
  LocalReferenceTitle: string;
  LocalReferenceUrl: string;
  LocalReferenceDocumentId: string;
  SensitiveDataLevelsAsCsv: string;
  MainContractSupplierName: string;
  ItSystemRightsHolderName: string;
  ObjectOwnerName: string;
  LastChangedByName: string;
  LastChangedAt: Date;
  Concluded: Date;
  ExpirationDate: Date;
  LifeCycleStatus: LifeCycleStatus | undefined;
  ArchiveDuty: ArchiveDutyChoice | undefined;
  IsHoldingDocument: boolean;
  ActiveArchivePeriodEndDate: Date;
  RiskSupervisionDocumentationName: string;
  LinkToDirectoryName: string;
  HostedAt: HostedAt | undefined;
  GeneralPurpose: string;
  DataProcessingRegistrationsConcludedAsCsv: YesNoIrrelevantOptions | undefined;
  DataProcessingRegistrationNamesAsCsv: string;
  DataProcessingRegistrations: { id: string; value: string }[];
  OutgoingRelatedItSystemUsages: { id: string; value: string }[];
  DependsOnInterfaces: { id: string; value: string }[];
  IncomingRelatedItSystemUsages: { id: string; value: string }[];
  AssociatedContracts: { id: string; value: string }[];
  Note: string;
  RiskAssessmentDate: Date;
  PlannedRiskAssessmentDate: Date;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITSystemUsage = (value: any): ITSystemUsage | undefined => {
  if (!value.SourceEntityUuid) return;

  const res = {
    Id: value.Id,
    ActiveAccordingToValidityPeriod: value.ActiveAccordingToValidityPeriod,
    Note: value.Note,
    RiskAssessmentDate: value.RiskAssessmentDate,
    PlannedRiskAssessmentDate: value.PlannedRiskAssessmentDate,
  };

  return {
    id: value.SourceEntityUuid,
    ActiveAccordingToValidityPeriod: value.ActiveAccordingToValidityPeriod,
    ActiveAccordingToLifeCycle: value.ActiveAccordingToLifeCycle,
    MainContractIsActive: value.MainContractIsActive,
    LocalSystemId: value.LocalSystemId,
    ItSystemUuid: value.ItSystemUuid,
    ExternalSystemUuid: value.ExternalSystemUuid,
    ParentItSystemName: value.ParentItSystemName,
    SystemName: value.SystemName,
    Version: value.Version,
    LocalCallName: value.LocalCallName,
    ResponsibleOrganizationUnitName: value.ResponsibleOrganizationUnitName,
    ResponsibleOrganizationUnitUuid: value.ResponsibleOrganizationUnitUuid,
    SystemPreviousName: value.SystemPreviousName,
    ItSystemBusinessTypeId: value.ItSystemBusinessTypeId,
    ItSystemBusinessTypeName: value.ItSystemBusinessTypeName,
    ItSystemKLEIdsAsCsv: value.ItSystemKLEIdsAsCsv,
    ItSystemKLENamesAsCsv: value.ItSystemKLENamesAsCsv,
    LocalReferenceTitle: value.LocalReferenceTitle,
    LocalReferenceUrl: value.LocalReferenceUrl,
    LocalReferenceDocumentId: value.LocalReferenceDocumentId,
    SensitiveDataLevelsAsCsv: value.SensitiveDataLevelsAsCsv,
    MainContractSupplierName: value.MainContractSupplierName,
    ItSystemRightsHolderName: value.ItSystemRightsHolderName,
    ObjectOwnerName: value.ObjectOwnerName,
    LastChangedByName: value.LastChangedByName,
    LastChangedAt: value.LastChangedAt,
    Concluded: value.Concluded,
    ExpirationDate: value.ExpirationDate,
    LifeCycleStatus: mapLifeCycleStatus(value.LifeCycleStatus),
    ArchiveDuty: mapArchiveDutyChoice(value.ArchiveDuty),
    IsHoldingDocument: value.IsHoldingDocument,
    ActiveArchivePeriodEndDate: value.ActiveArchivePeriodEndDate,
    RiskSupervisionDocumentationName: value.RiskSupervisionDocumentationName,
    LinkToDirectoryName: value.LinkToDirectoryName,
    HostedAt: mapHostedAt(value.HostedAt),
    GeneralPurpose: value.GeneralPurpose,
    DataProcessingRegistrationsConcludedAsCsv: mapToYesNoIrrelevantEnum(
      value.DataProcessingRegistrationsConcludedAsCsv
    ),
    DataProcessingRegistrationNamesAsCsv: value.DataProcessingRegistrationNamesAsCsv,
    DataProcessingRegistrations: value.DataProcessingRegistrations?.map(
      (registration: { DataProcessingRegistrationUuid: string; DataProcessingRegistrationName: string }) => ({
        id: registration.DataProcessingRegistrationUuid,
        value: registration.DataProcessingRegistrationName,
      })
    ),
    OutgoingRelatedItSystemUsages: value.OutgoingRelatedItSystemUsages?.map(
      (relatedItSystem: { ItSystemUsageUuid: string; ItSystemUsageName: string }) => ({
        id: relatedItSystem.ItSystemUsageUuid,
        value: relatedItSystem.ItSystemUsageName,
      })
    ),
    DependsOnInterfaces: value.DependsOnInterfaces?.map(
      (interfaceItem: { InterfaceUuid: string; InterfaceName: string }) => ({
        id: interfaceItem.InterfaceUuid,
        value: interfaceItem.InterfaceName,
      })
    ),
    IncomingRelatedItSystemUsages: value.IncomingRelatedItSystemUsages?.map(
      (relatedItSystem: { ItSystemUsageUuid: string; ItSystemUsageName: string }) => ({
        id: relatedItSystem.ItSystemUsageUuid,
        value: relatedItSystem.ItSystemUsageName,
      })
    ),
    AssociatedContracts: value.AssociatedContracts?.map(
      (contract: { ItContractUuid: string; ItContractName: string }) => ({
        id: contract.ItContractUuid,
        value: contract.ItContractName,
      })
    ),
    Note: value.Note,
    RiskAssessmentDate: value.RiskAssessmentDate,
    PlannedRiskAssessmentDate: value.PlannedRiskAssessmentDate,
  };
};
