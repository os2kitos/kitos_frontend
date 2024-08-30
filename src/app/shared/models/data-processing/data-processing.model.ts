import { mapRoleAssignmentsToUserFullNames } from '../helpers/read-model-role-assignments';
import { IsAgreementConcluded, mapIsAgreementConcluded } from './is-agreement-concluded.model';
import { IsOversightCompleted, mapIsOversightCompleted } from './is-oversight-completed.model';
import {
  mapTransferToInsecureThirdCountries,
  TransferToInsecureThirdCountries,
} from './transfer-to-insecure-third-countries.model';
import { mapToYearMonthInterval, YearMonthInterval } from './year-month-interval.model';

export interface DataProcessingRegistration {
  id: string;
  Name: string;
  IsActive: boolean;
  LastChangedById: number;
  LastChangedAt: string;
  ActiveAccordingToMainContract: boolean;
  MainReferenceTitle: string;
  MainReferenceUrl: string;
  MainReferenceUserAssignedId: string;
  SystemNamesAsCsv: string;
  SystemUuidsAsCsv: string;
  DataProcessorNamesAsCsv: string;
  SubDataProcessorNamesAsCsv: string;
  TransferToInsecureThirdCountries: TransferToInsecureThirdCountries | undefined;
  BasisForTransfer: string;
  BasisForTransferUuid: string;
  DataResponsible: string;
  DataResponsibleUuid: string;
  IsAgreementConcluded: IsAgreementConcluded | undefined;
  AgreementConcludedAt: string;
  OversightInterval: YearMonthInterval | undefined;
  OversightOptionNamesAsCsv: string;
  IsOversightCompleted: IsOversightCompleted | undefined;
  OversightScheduledInspectionDate: string;
  LatestOversightDate: string;
  LastChangedByName: string;
  ContractNamesAsCsv: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Roles: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptDataProcessingRegistration = (value: any): DataProcessingRegistration | undefined => {
  if (!value.SourceEntityUuid) return;

  return {
    id: value.SourceEntityUuid,
    Name: value.Name,
    IsActive: value.IsActive,
    LastChangedById: value.LastChangedById,
    LastChangedAt: value.LastChangedAt,
    ActiveAccordingToMainContract: value.ActiveAccordingToMainContract,
    MainReferenceTitle: value.MainReferenceTitle,
    MainReferenceUrl: value.MainReferenceUrl,
    MainReferenceUserAssignedId: value.MainReferenceUserAssignedId,
    SystemNamesAsCsv: value.SystemNamesAsCsv,
    SystemUuidsAsCsv: value.SystemUuidsAsCsv,
    DataProcessorNamesAsCsv: value.DataProcessorNamesAsCsv,
    SubDataProcessorNamesAsCsv: value.SubDataProcessorNamesAsCsv,
    TransferToInsecureThirdCountries: mapTransferToInsecureThirdCountries(value.TransferToInsecureThirdCountries),
    BasisForTransfer: value.BasisForTransfer,
    BasisForTransferUuid: value.basisForTransferUuid,
    DataResponsible: value.DataResponsible,
    DataResponsibleUuid: value.dataResponsibleUuid,
    IsAgreementConcluded: mapIsAgreementConcluded(value.IsAgreementConcluded),
    AgreementConcludedAt: value.AgreementConcludedAt,
    OversightInterval: mapToYearMonthInterval(value.OversightInterval),
    OversightOptionNamesAsCsv: value.OversightOptionNamesAsCsv,
    IsOversightCompleted: mapIsOversightCompleted(value.IsOversightCompleted),
    OversightScheduledInspectionDate: value.OversightScheduledInspectionDate,
    LatestOversightDate: value.LatestOversightDate,
    LastChangedByName: value.LastChangedByName,
    ContractNamesAsCsv: value.ContractNamesAsCsv,
    Roles: mapRoleAssignmentsToUserFullNames(value.RoleAssignments),
  };
};
