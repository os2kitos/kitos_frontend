import { GridDataResult } from '@progress/kendo-angular-grid';
import { APIStsOrganizationOrgUnitDTO, APIStsOrganizationSynchronizationDetailsResponseDTO } from 'src/app/api/v2';

export interface FkOrgState {
  synchronizationStatus: APIStsOrganizationSynchronizationDetailsResponseDTO | undefined;
  accessError: string | undefined;
  isLoadingConnectionStatus: boolean;

  snapshot: APIStsOrganizationOrgUnitDTO | undefined;
  updateConsequences: GridDataResult | undefined;
  isSynchronizationDialogLoading: boolean;
  hasSnapshotFailed: boolean;
}
