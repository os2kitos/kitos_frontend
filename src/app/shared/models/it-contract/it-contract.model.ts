import { formatProcurementPlan } from '../../helpers/procurement-plan.helpers';
import {
  mapRoleAssignmentsToEmails,
  mapRoleAssignmentsToUserFullNames,
  RoleAssignmentEmailsMaps,
  RoleAssignmentsMap,
} from '../helpers/read-model-role-assignments';
import { mapToYesNoEnum } from '../yes-no.model';

export interface ITContract {
  id: string;
  IsActive: boolean;
  ContractId: string;
  ParentContractName: string;
  ParentContractUuid: string;
  Name: string;
  Concluded: Date;
  ExpirationDate: Date;
  CriticalityName: string;
  ResponsibleOrgUnitName: string;
  SupplierName: string;
  ContractSigner: string;
  ContractTypeName: string;
  ContractTemplateName: string;
  PurchaseFormName: string;
  ProcurementStrategyName: string;
  ProcurementPlanYear: string;
  ProcurementInitiated: string;
  DataProcessingAgreements: { id: string; value: string }[];
  ItSystemUsages: { id: string; value: string }[];
  ItSystemUsageUuids: { value: string }[];
  ItSystemUsageUuidsAsCsv: string;
  SourceEntityUuid: string;
  NumberOfAssociatedSystemRelations: number;
  ActiveReferenceTitle: string;
  ActiveReferenceUrl: string;
  ActiveReferenceExternalReferenceId: string;
  AccumulatedAcquisitionCost: number;
  AccumulatedOperationCost: number;
  AccumulatedOtherCost: number;
  LatestAuditDate: Date;
  AuditStatusGreen: number;
  AuditStatusRed: number;
  AuditStatusWhite: number;
  AuditStatusYellow: number;
  OperationRemunerationBegunDate: Date;
  PaymentModelName: string;
  PaymentFrequencyName: string;
  Duration: string;
  OptionExtendName: string;
  TerminationDeadlineName: string;
  IrrevocableTo: Date;
  TerminatedAt: Date;
  LastEditedByUserName: string;
  LastEditedAtDate: Date;
  Roles: RoleAssignmentsMap;
  RoleEmails: RoleAssignmentEmailsMaps;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITContract = (value: any): ITContract | undefined => {
  if (!value.SourceEntityUuid) return;
  const procurementPlan =
    value.ProcurementPlanQuarter == null || value.ProcurementPlanYear == null
      ? ''
      : formatProcurementPlan(value.ProcurementPlanYear, value.ProcurementPlanQuarter);
  return {
    id: value.SourceEntityUuid,
    IsActive: value.IsActive,
    ContractId: value.ContractId,
    ParentContractName: value.ParentContractName,
    ParentContractUuid: value.ParentContractUuid,
    Name: value.Name,
    Concluded: value.Concluded,
    ExpirationDate: value.ExpirationDate,
    CriticalityName: value.CriticalityName,
    ResponsibleOrgUnitName: value.ResponsibleOrgUnitName,
    SupplierName: value.SupplierName,
    ContractSigner: value.ContractSigner,
    ContractTypeName: value.ContractTypeName,
    ContractTemplateName: value.ContractTemplateName,
    PurchaseFormName: value.PurchaseFormName,
    ProcurementStrategyName: value.ProcurementStrategyName,
    ProcurementPlanYear: procurementPlan,
    ProcurementInitiated: mapToYesNoEnum(value.ProcurementInitiated)?.name ?? '',
    DataProcessingAgreements: value.DataProcessingAgreements.map(
      (dpa: { DataProcessingRegistrationUuid: string; DataProcessingRegistrationName: string }) => ({
        id: dpa.DataProcessingRegistrationUuid,
        value: dpa.DataProcessingRegistrationName,
      })
    ),
    ItSystemUsageUuids: value.ItSystemUsageUuids,
    ItSystemUsageUuidsAsCsv: value.ItSystemUsagesSystemUuidCsv,
    ItSystemUsages: value.ItSystemUsages.map((usage: { ItSystemUsageUuid: string; ItSystemUsageName: string }) => ({
      id: usage.ItSystemUsageUuid,
      value: usage.ItSystemUsageName,
    })),
    SourceEntityUuid: value.SourceEntityUuid,
    NumberOfAssociatedSystemRelations: value.NumberOfAssociatedSystemRelations,
    ActiveReferenceTitle: value.ActiveReferenceTitle,
    ActiveReferenceUrl: value.ActiveReferenceUrl,
    ActiveReferenceExternalReferenceId: value.ActiveReferenceExternalReferenceId,
    AccumulatedAcquisitionCost: value.AccumulatedAcquisitionCost,
    AccumulatedOperationCost: value.AccumulatedOperationCost,
    AccumulatedOtherCost: value.AccumulatedOtherCost,
    OperationRemunerationBegunDate: value.OperationRemunerationBegunDate,
    LatestAuditDate: value.LatestAuditDate,
    AuditStatusGreen: value.AuditStatusGreen,
    AuditStatusRed: value.AuditStatusRed,
    AuditStatusWhite: value.AuditStatusWhite,
    AuditStatusYellow: value.AuditStatusYellow,
    PaymentModelName: value.PaymentModelName,
    PaymentFrequencyName: value.PaymentFrequencyName,
    Duration: value.Duration,
    OptionExtendName: value.OptionExtendName,
    TerminationDeadlineName: value.TerminationDeadlineName,
    IrrevocableTo: value.IrrevocableTo,
    TerminatedAt: value.TerminatedAt,
    LastEditedByUserName: value.LastEditedByUserName,
    LastEditedAtDate: value.LastEditedAtDate,
    Roles: mapRoleAssignmentsToUserFullNames(value.RoleAssignments),
    RoleEmails: mapRoleAssignmentsToEmails(value.RoleAssignments),
  };
};
