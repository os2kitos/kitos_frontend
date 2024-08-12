import { IsAgreementConcluded, mapIsAgreementConcluded } from './is-agreement-concluded.model';
import { IsOversightCompleted, mapIsOversightCompleted } from './is-oversight-completed.model';
import { mapToOversightInterval, OversightInterval } from './oversight-interval.model';
import {
  mapTransferToInsecureThirdCountries,
  TransferToInsecureThirdCountries,
} from './transfer-to-insecure-third-countries.model';

export interface DataProcessingRegistration {
  id: string;
  name: string;
  disabled: boolean;
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
  dataResponsible: string;
  isAgreementConcluded: IsAgreementConcluded | undefined;
  agreementConcludedAt: string;
  oversightInterval: OversightInterval | undefined;
  oversightOptionNamesAsCsv: string;
  isOversightCompleted: IsOversightCompleted | undefined;
  oversightScheduledInspectionDate: string;
  latestOversightDate: string;
  lastChangedByName: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const adaptDataProcessingRegistration = (value: any): DataProcessingRegistration | undefined => {
  if (!value.SourceEntityUuid) return;

  return {
    id: value.SourceEntityUuid,
    name: value.Name,
    disabled: value.IsActive === 'false',
    lastChangedById: value.LastChangedById,
    lastChangedAt: value.LastChangedAt,
    activeAccordingToMainContract: value.activeAccordingToMainContract,
    mainReferenceTitle: value.mainReferenceTitle,
    mainReferenceUserAssignedId: value.mainReferenceUserAssignedId,
    systemNamesAsCsv: value.systemNamesAsCsv,
    systemUuidsAsCsv: value.systemUuidsAsCsv,
    dataProcessorNamesAsCsv: value.dataProcessorNamesAsCsv,
    subDataProcessorNamesAsCsv: value.subDataProcessorNamesAsCsv,
    transferToInsecureThirdCountries: mapTransferToInsecureThirdCountries(value.transferToInsecureThirdCountries),
    basisForTransfer: value.basisForTransfer,
    dataResponsible: value.dataResponsible,
    isAgreementConcluded: mapIsAgreementConcluded(value.isAgreementConcluded),
    agreementConcludedAt: value.agreementConcludedAt,
    oversightInterval: mapToOversightInterval(value.oversightInterval),
    oversightOptionNamesAsCsv: value.oversightOptionNamesAsCsv,
    isOversightCompleted: mapIsOversightCompleted(value.isOversightCompleted),
    oversightScheduledInspectionDate: value.oversightScheduledInspectionDate,
    latestOversightDate: value.latestOversightDate,
    lastChangedByName: value.lastChangedByName,
  };
};
