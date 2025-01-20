import { APIDataProcessingRegistrationGeneralDataResponseDTO } from 'src/app/api/v2';
import { entityWithUnavailableName } from '../../helpers/string.helpers';
import {
  mapRoleAssignmentsToEmails,
  mapRoleAssignmentsToUserFullNames,
  RoleAssignmentEmailsMaps,
  RoleAssignmentsMap,
} from '../helpers/read-model-role-assignments';
import { LifeCycleStatus, mapLifeCycleStatus } from '../life-cycle-status.model';
import { mapGridNumberOfExpectedUsers, NumberOfExpectedUsersGrid } from '../number-of-expected-users.model';
import { YesNoDontKnowOptions } from '../yes-no-dont-know.model';
import { mapCapitalizedStringToYesNoIrrelevantEnum, mapToYesNoIrrelevantEnumGrid } from '../yes-no-irrelevant.model';
import { ArchiveDutyChoice, mapArchiveDutyChoice } from './archive-duty-choice.model';
import { HostedAt, mapGridHostedAt } from './gdpr/hosted-at.model';
import { AppPath } from '../../enums/app-path';

export interface ITSystemUsage {
  //ngrx requires the id field to have lowercase 'id' name
  id: string;
  SystemActive: boolean;
  ActiveAccordingToValidityPeriod: boolean;
  ActiveAccordingToLifeCycle: boolean;
  MainContractIsActive: boolean;
  LocalSystemId: string;
  ItSystemUuid: string;
  SystemDescription: string;
  ExternalSystemUuid: string;
  ParentItSystemName: string;
  ParentItSystemUuid: string;
  ParentSystemLinkPaths: {value: string, id: string}[];
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
  DataProcessingRegistrationsConcluded: { id: string; value: string }[];
  OutgoingRelatedItSystemUsages: { id: string; value: string }[];
  DependsOnInterfaces: { id: string; value: string }[];
  IncomingRelatedItSystemUsages: { id: string; value: string }[];
  RelevantOrganizationUnitNamesAsCsv: string;
  AssociatedContracts: { id: string; value: string }[];
  ItSystemCategoriesName: string;
  Note: string;
  RiskAssessmentDate: Date;
  PlannedRiskAssessmentDate: Date;
  UserCount: NumberOfExpectedUsersGrid | undefined;
  Roles: RoleAssignmentsMap;
  RoleEmails: RoleAssignmentEmailsMaps;
}

function getParentItSystemLinkPaths(value: {
  ParentItSystemUsageUuid: string | undefined,
  ParentItSystemUuid: string | undefined,
  ParentItSystemName: string | undefined })
  {
    const links: {id: string, value: string}[] = [];
    if (!value.ParentItSystemUuid || !value.ParentItSystemName) return links;

    links.push({
      id: `${AppPath.itSystemCatalog}/${value.ParentItSystemUuid}`,
      value: value.ParentItSystemName
    });

    if (value.ParentItSystemUsageUuid) {
      links.push({
        id: `${AppPath.itSystemUsages}/${value.ParentItSystemUsageUuid}`,
        value: $localize`Gå til systemanvendelse`
      });
    }

    return links;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptITSystemUsage = (value: any): ITSystemUsage | undefined => {
  if (!value.SourceEntityUuid) return;

  return {
    ParentSystemLinkPaths: getParentItSystemLinkPaths(value),
    id: value.SourceEntityUuid,
    SystemActive: value.SystemActive,
    ActiveAccordingToValidityPeriod: value.ActiveAccordingToValidityPeriod,
    ActiveAccordingToLifeCycle: value.ActiveAccordingToLifeCycle,
    MainContractIsActive: value.MainContractIsActive,
    LocalSystemId: value.LocalSystemId,
    ItSystemUuid: value.ItSystemUuid,
    SystemDescription: value.SystemDescription,
    ExternalSystemUuid: value.ExternalSystemUuid,
    ParentItSystemName: value.ParentItSystemName,
    ParentItSystemUuid: value.ParentItSystemUuid,
    SystemName: entityWithUnavailableName(value.SystemName, value.SystemActive),
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
    DataProcessingRegistrationsConcluded: getDataProcessingRegistrationsConcluded(value),
    OutgoingRelatedItSystemUsages: value.OutgoingRelatedItSystemUsages?.map(
      (relatedItSystem: { ItSystemUsageUuid: string; ItSystemUsageName: string }) => ({
        id: relatedItSystem.ItSystemUsageUuid,
        value: relatedItSystem.ItSystemUsageName,
      })
    ),
    RelevantOrganizationUnitNamesAsCsv: value.RelevantOrganizationUnitNamesAsCsv,
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
    UserCount: mapGridNumberOfExpectedUsers(value.UserCount),
    ItSystemCategoriesName: value.ItSystemCategoriesName,
    Roles: mapRoleAssignmentsToUserFullNames(value.RoleAssignments),
    RoleEmails: mapRoleAssignmentsToEmails(value.RoleAssignments),
  };
};

function getDataProcessingRegistrationsConcluded(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
): { id: string; value: string }[] {
  return value.DataProcessingRegistrations?.map(
    (registration: {
      DataProcessingRegistrationUuid: string;
      IsAgreementConcluded: APIDataProcessingRegistrationGeneralDataResponseDTO.IsAgreementConcludedEnum;
    }) => ({
      id: registration.DataProcessingRegistrationUuid,
      value: mapCapitalizedStringToYesNoIrrelevantEnum(registration.IsAgreementConcluded)?.name,
    })
  ).filter((r: { value: string }) => r.value !== undefined);
}
