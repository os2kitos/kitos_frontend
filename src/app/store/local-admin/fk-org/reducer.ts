import { createFeature, createReducer, on } from '@ngrx/store';
import { APIStsOrganizationAccessStatusResponseDTO } from 'src/app/api/v2';
import { FkOrgActions } from './actions';
import { FkOrgState } from './state';

export const fkOrgInitialState: FkOrgState = {
  synchronizationStatus: undefined,
  accessError: undefined,
  isLoadingConnectionStatus: false,
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
    )
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
