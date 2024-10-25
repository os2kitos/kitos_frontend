import { createFeature, createReducer, on } from '@ngrx/store';
import { APIStsOrganizationAccessStatusResponseDTO, APIStsOrganizationChangeLogResponseDTO } from 'src/app/api/v2';
import { mapDateToString } from 'src/app/shared/helpers/date.helpers';
import { DropdownOption } from 'src/app/shared/models/dropdown-option.model';
import {
  FkOrgChangeLogDictionary,
  FkOrgChangeLogModel,
} from 'src/app/shared/models/local-admin/fk-org-change-log.dictionary';
import { adaptFkOrganizationUnit } from 'src/app/shared/models/local-admin/fk-org-consequence.model';
import { getResponsibleEntityTextBasedOnOrigin } from '../../helpers/fk-org-helper';
import { FkOrgActions } from './actions';
import { FkOrgState } from './state';

export const fkOrgInitialState: FkOrgState = {
  synchronizationStatus: undefined,
  accessError: undefined,
  isLoadingConnectionStatus: false,

  isDeleteLoading: false,

  snapshot: undefined,
  updateConsequences: undefined,
  isSynchronizationDialogLoading: false,
  hasSnapshotFailed: false,

  isLoadingChangelogs: false,
  availableChangelogOptions: undefined,
  changelogDictionary: undefined,
};

export const fkOrgFeature = createFeature({
  name: 'FkOrg',
  reducer: createReducer(
    fkOrgInitialState,
    on(
      FkOrgActions.getSynchronizationStatus,
      (state): FkOrgState => ({
        ...state,
        synchronizationStatus: undefined,
        accessError: undefined,
        isLoadingConnectionStatus: true,
      })
    ),
    on(FkOrgActions.getSynchronizationStatusSuccess, (state, { synchronizationStatus }): FkOrgState => {
      let accessError = undefined;
      if (synchronizationStatus.accessStatus?.error) {
        accessError = handleAccessError(synchronizationStatus.accessStatus.error);
      }

      return { ...state, synchronizationStatus, accessError, isLoadingConnectionStatus: false };
    }),
    on(
      FkOrgActions.getSynchronizationStatusError,
      (state): FkOrgState => ({
        ...state,
        accessError: handleAccessError('Unknown'),
      })
    ),

    on(
      FkOrgActions.getSnapshot,
      (state): FkOrgState => ({
        ...state,
        snapshot: undefined,
        isSynchronizationDialogLoading: true,
        hasSnapshotFailed: false,
        updateConsequences: undefined, //reset update consequences when snapshot is requested
      })
    ),
    on(
      FkOrgActions.getSnapshotSuccess,
      (state, { snapshot }): FkOrgState => ({ ...state, snapshot, isSynchronizationDialogLoading: false })
    ),
    on(
      FkOrgActions.getSnapshotError,
      (state): FkOrgState => ({ ...state, isSynchronizationDialogLoading: false, hasSnapshotFailed: true })
    ),

    on(FkOrgActions.createConnection, (state): FkOrgState => ({ ...state, isSynchronizationDialogLoading: true })),
    on(
      FkOrgActions.createConnectionSuccess,
      (state): FkOrgState => ({ ...state, isSynchronizationDialogLoading: false })
    ),
    on(
      FkOrgActions.createConnectionError,
      (state): FkOrgState => ({ ...state, isSynchronizationDialogLoading: false })
    ),
    on(
      FkOrgActions.previewConnectionUpdate,
      (state): FkOrgState => ({ ...state, isSynchronizationDialogLoading: true })
    ),
    on(
      FkOrgActions.previewConnectionUpdateSuccess,
      (state, { response }): FkOrgState => ({
        ...state,
        updateConsequences: response.consequences?.map((unit) => adaptFkOrganizationUnit(unit)) ?? [],
        isSynchronizationDialogLoading: false,
      })
    ),
    on(
      FkOrgActions.previewConnectionUpdateError,
      (state): FkOrgState => ({ ...state, isSynchronizationDialogLoading: false, hasSnapshotFailed: true })
    ),
    on(FkOrgActions.cancelUpdate, (state): FkOrgState => ({ ...state, updateConsequences: undefined })),

    on(FkOrgActions.updateConnection, (state): FkOrgState => ({ ...state, isSynchronizationDialogLoading: true })),
    on(
      FkOrgActions.updateConnectionSuccess,
      (state): FkOrgState => ({ ...state, isSynchronizationDialogLoading: false })
    ),
    on(
      FkOrgActions.updateConnectionError,
      (state): FkOrgState => ({ ...state, isSynchronizationDialogLoading: false })
    ),

    on(FkOrgActions.deleteAutomaticUpdateSubscription, (state): FkOrgState => ({ ...state, isDeleteLoading: true })),
    on(
      FkOrgActions.deleteAutomaticUpdateSubscriptionSuccess,
      (state): FkOrgState => ({ ...state, isDeleteLoading: false })
    ),
    on(
      FkOrgActions.deleteAutomaticUpdateSubscriptionError,
      (state): FkOrgState => ({ ...state, isDeleteLoading: false })
    ),

    on(FkOrgActions.getChangelog, (state): FkOrgState => ({ ...state, isLoadingChangelogs: true })),
    on(FkOrgActions.getChangelogSuccess, (state, { changelogs }): FkOrgState => {
      const changelogDictionary: FkOrgChangeLogDictionary = {};
      const availableChangeLogs: DropdownOption<string>[] = [];
      changelogs.forEach((changelog) => {
        if (changelog.logTime) {
          changelogDictionary[changelog.logTime] = mapChangelogModel(changelog);

          availableChangeLogs.push(mapChangelogToChangelogOption(changelog));
        }
      });

      return {
        ...state,
        changelogDictionary,
        availableChangelogOptions: availableChangeLogs,
        isLoadingChangelogs: false,
      };
    }),
    on(FkOrgActions.getChangelogError, (state): FkOrgState => ({ ...state, isLoadingChangelogs: false }))
  ),
});

function handleAccessError(error: APIStsOrganizationAccessStatusResponseDTO.ErrorEnum) {
  switch (error) {
    case APIStsOrganizationAccessStatusResponseDTO.ErrorEnum.ExistingServiceAgreementIssue:
      return $localize`Der er problemer med den eksisterende serviceaftale, der giver KITOS adgang til data fra din kommune i FK Organisatoin. Kontakt venligst den KITOS ansvarlige i din kommune for hjælp.`;
    case APIStsOrganizationAccessStatusResponseDTO.ErrorEnum.InvalidCvrOnOrganization:
      return $localize`Der enten mangler eller er registreret et ugyldigt CVR nummer på din kommune i KITOS.`;
    case APIStsOrganizationAccessStatusResponseDTO.ErrorEnum.UserContextDoesNotExistOnSystem: //intended fallthrough
    case APIStsOrganizationAccessStatusResponseDTO.ErrorEnum.MissingServiceAgreement:
      return $localize`Din organisation mangler en gyldig serviceaftale der giver KITOS adgang til data fra din kommune i FK Organisation. Kontakt venligst den KITOS ansvarlige i din kommune for hjælp.`;
    case APIStsOrganizationAccessStatusResponseDTO.ErrorEnum.Unknown: //intended fallthrough
    default:
      return $localize`Der skete en fejl ifm. tjek for forbindelsen til FK Organisation. Genindlæs venligst siden for at prøve igen.`;
  }
}

function mapChangelogModel(changelog: APIStsOrganizationChangeLogResponseDTO): FkOrgChangeLogModel {
  return {
    ...changelog,
    consequences: changelog.consequences?.map((unit) => adaptFkOrganizationUnit(unit)) ?? [],
  };
}

function mapChangelogToChangelogOption(changelog: APIStsOrganizationChangeLogResponseDTO): DropdownOption<string> {
  return {
    value: changelog.logTime!,
    name: mapDateToString(changelog.logTime!),
    description: getResponsibleEntityTextBasedOnOrigin(changelog),
  };
}
