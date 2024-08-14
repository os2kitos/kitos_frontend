import { LifeCycleStatus, mapLifeCycleStatus } from '../life-cycle-status.model';
import { YesNoDontKnowOptions } from '../yes-no-dont-know.model';
import { mapToYesNoIrrelevantEnumGrid } from '../yes-no-irrelevant.model';
import { ArchiveDutyChoice, mapArchiveDutyChoice } from './archive-duty-choice.model';
import { HostedAt, mapGridHostedAt } from './gdpr/hosted-at.model';

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
  ParentItSystemUuid: string;
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
  RiskSupervisionDocumentationUrl: string;
  LinkToDirectoryName: string;
  LinkToDirectoryUrl: string;
  HostedAt: HostedAt | undefined;
  GeneralPurpose: string;
  DataProcessingRegistrationsConcludedAsCsv: YesNoDontKnowOptions | undefined;
  DataProcessingRegistrationNamesAsCsv: string;
  DataProcessingRegistrations: { id: string; value: string }[];
  OutgoingRelatedItSystemUsages: { id: string; value: string }[];
  DependsOnInterfaces: { id: string; value: string }[];
  IncomingRelatedItSystemUsages: { id: string; value: string }[];
  AssociatedContracts: { id: string; value: string }[];
  Note: string;
  RiskAssessmentDate: Date;
  PlannedRiskAssessmentDate: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Roles: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITSystemUsage = (value: any): ITSystemUsage | undefined => {
  if (!value.SourceEntityUuid) return;

  return {
    id: value.SourceEntityUuid,
    ActiveAccordingToValidityPeriod: value.ActiveAccordingToValidityPeriod,
    ActiveAccordingToLifeCycle: value.ActiveAccordingToLifeCycle,
    MainContractIsActive: value.MainContractIsActive,
    LocalSystemId: value.LocalSystemId,
    ItSystemUuid: value.ItSystemUuid,
    ExternalSystemUuid: value.ExternalSystemUuid,
    ParentItSystemName: value.ParentItSystemName,
    ParentItSystemUuid: value.ParentItSystemUuid,
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
    RiskSupervisionDocumentationUrl: value.RiskSupervisionDocumentationUrl,
    LinkToDirectoryName: value.LinkToDirectoryName,
    LinkToDirectoryUrl: value.LinkToDirectoryUrl,
    HostedAt: mapGridHostedAt(value.HostedAt),
    GeneralPurpose: value.GeneralPurpose,
    DataProcessingRegistrationsConcludedAsCsv: mapToYesNoIrrelevantEnumGrid(
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
    Roles: (() => {
      const roles: { [key: string]: string } = {};
      value.RoleAssignments?.forEach((assignment: { RoleId: number; UserFullName: string }) => {
        const roleKey = `Role${assignment.RoleId}`;
        if (!roles[roleKey]) {
          roles[roleKey] = assignment.UserFullName;
        } else {
          roles[roleKey] += `, ${assignment.UserFullName}`;
        }
      });
      return roles;
    })(),
  };
};
