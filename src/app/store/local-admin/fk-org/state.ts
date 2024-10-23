import { APIStsOrganizationOrgUnitDTO, APIStsOrganizationSynchronizationDetailsResponseDTO } from 'src/app/api/v2';
import { FkOrganizationUnit } from 'src/app/shared/models/local-admin/fk-org-consequence.model';

export interface FkOrgState {
  synchronizationStatus: APIStsOrganizationSynchronizationDetailsResponseDTO | undefined;
  accessError: string | undefined;
  isLoadingConnectionStatus: boolean;

  snapshot: APIStsOrganizationOrgUnitDTO | undefined;
  updateConsequences: FkOrganizationUnit[] | undefined;
  isSynchronizationDialogLoading: boolean;
  hasSnapshotFailed: boolean;
}
