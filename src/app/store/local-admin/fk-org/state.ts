import { APIStsOrganizationOrgUnitDTO, APIStsOrganizationSynchronizationDetailsResponseDTO } from 'src/app/api/v2';

export interface FkOrgState {
  synchronizationStatus: APIStsOrganizationSynchronizationDetailsResponseDTO | undefined;
  accessError: string | undefined;
  isLoadingConnectionStatus: boolean;

  snapshot: APIStsOrganizationOrgUnitDTO | undefined;
  isSynchronizationDialogLoading: boolean;
  hasSnapshotFailed: boolean;
}
