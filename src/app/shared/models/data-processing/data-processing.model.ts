import { mapReadModelRoleAssignments } from '../helpers/read-model-role-assignments';
import { IsAgreementConcluded, mapIsAgreementConcluded } from './is-agreement-concluded.model';
import { IsOversightCompleted, mapIsOversightCompleted } from './is-oversight-completed.model';
import {
  mapTransferToInsecureThirdCountries,
  TransferToInsecureThirdCountries,
} from './transfer-to-insecure-third-countries.model';
import { mapToYearMonthInterval, YearMonthInterval } from './year-month-interval.model';

export interface DataProcessingRegistration {
  id: string;
  name: string;
  isActive: boolean;
  lastChangedById: number;
  lastChangedAt: string;
  activeAccordingToMainContract: boolean;
  mainReferenceTitle: string;
  mainReferenceUserAssignedId: string;
  systemNamesAsCsv: string;
  systemUuidsAsCsv: string;
  dataProcessorNamesAsCsv: string;
  subDataProcessorNamesAsCsv: string;
  transferToInsecureThirdCountries: TransferToInsecureThirdCountries | undefined;
  basisForTransfer: string;
  basisForTransferUuid: string;
  dataResponsible: string;
  dataResponsibleUuid: string;
  isAgreementConcluded: IsAgreementConcluded | undefined;
  agreementConcludedAt: string;
  oversightInterval: YearMonthInterval | undefined;
  oversightOptionNamesAsCsv: string;
  isOversightCompleted: IsOversightCompleted | undefined;
  oversightScheduledInspectionDate: string;
  latestOversightDate: string;
  lastChangedByName: string;
  contractNamesAsCsv: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roles: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptDataProcessingRegistration = (value: any): DataProcessingRegistration | undefined => {
  if (!value.SourceEntityUuid) return;

  return {
    id: value.SourceEntityUuid,
    name: value.Name,
    isActive: value.IsActive,
    lastChangedById: value.LastChangedById,
    lastChangedAt: value.LastChangedAt,
    activeAccordingToMainContract: value.ActiveAccordingToMainContract,
    mainReferenceTitle: value.MainReferenceTitle,
    mainReferenceUserAssignedId: value.MainReferenceUserAssignedId,
    systemNamesAsCsv: value.SystemNamesAsCsv,
    systemUuidsAsCsv: value.SystemUuidsAsCsv,
    dataProcessorNamesAsCsv: value.DataProcessorNamesAsCsv,
    subDataProcessorNamesAsCsv: value.SubDataProcessorNamesAsCsv,
    transferToInsecureThirdCountries: mapTransferToInsecureThirdCountries(value.TransferToInsecureThirdCountries),
    basisForTransfer: value.BasisForTransfer,
    basisForTransferUuid: value.basisForTransferUuid,
    dataResponsible: value.DataResponsible,
    dataResponsibleUuid: value.dataResponsibleUuid,
    isAgreementConcluded: mapIsAgreementConcluded(value.IsAgreementConcluded),
    agreementConcludedAt: value.AgreementConcludedAt,
    oversightInterval: mapToYearMonthInterval(value.OversightInterval),
    oversightOptionNamesAsCsv: value.OversightOptionNamesAsCsv,
    isOversightCompleted: mapIsOversightCompleted(value.IsOversightCompleted),
    oversightScheduledInspectionDate: value.OversightScheduledInspectionDate,
    latestOversightDate: value.LatestOversightDate,
    lastChangedByName: value.LastChangedByName,
    contractNamesAsCsv: value.ContractNamesAsCsv,
    roles: mapReadModelRoleAssignments(value.RoleAssignments),
  };
};
