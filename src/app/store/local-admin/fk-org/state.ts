import { APIStsOrganizationOrgUnitDTO, APIStsOrganizationSynchronizationDetailsResponseDTO } from 'src/app/api/v2';
import { DropdownOption } from 'src/app/shared/models/dropdown-option.model';
import { FkOrgChangeLogDictionary } from 'src/app/shared/models/local-admin/fk-org-change-log.dictionary';
import { FkOrganizationUnit } from 'src/app/shared/models/local-admin/fk-org-consequence.model';

export interface FkOrgState {
  synchronizationStatus: APIStsOrganizationSynchronizationDetailsResponseDTO | undefined;
  accessError: string | undefined;
  isLoadingConnectionStatus: boolean;

  snapshot: APIStsOrganizationOrgUnitDTO | undefined;
  updateConsequences: FkOrganizationUnit[] | undefined;
  isSynchronizationDialogLoading: boolean;
  hasSnapshotFailed: boolean;

  isLoadingChangelogs: boolean;
  availableChangelogs: DropdownOption<string>[] | undefined;
  changelogDictionary: FkOrgChangeLogDictionary | undefined;
}
