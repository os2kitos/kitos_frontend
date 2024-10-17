import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { mergeMap, tap } from 'rxjs';
import {
  APIStsOrganizationSynchronizationDetailsResponseDTO,
  APIV2StsOrganizationSynchronizationInternalINTERNALService,
} from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  synchronizationStatus?: APIStsOrganizationSynchronizationDetailsResponseDTO;
  accessError?: string;
  isLoadingConnectionStatus: boolean;
}

@Injectable()
export class FkOrgComponentStore extends ComponentStore<State> {
  public readonly synchronizationStatus$ = this.select((state) => state.synchronizationStatus);
  public readonly accessError$ = this.select((state) => state.accessError);
  public readonly accessGranted$ = this.select((state) => state.synchronizationStatus?.accessStatus?.accessGranted);
  public readonly isConnected$ = this.select((state) => state.synchronizationStatus?.connected);
  public readonly isLoadingConnectionStatus$ = this.select((state) => state.isLoadingConnectionStatus);

  constructor(
    @Inject(APIV2StsOrganizationSynchronizationInternalINTERNALService)
    private apiService: APIV2StsOrganizationSynchronizationInternalINTERNALService,
    private store: Store
  ) {
    super({ isLoadingConnectionStatus: false });
  }

  private updateSynchronizationStatus = this.updater(
    (state, synchronizationStatus: APIStsOrganizationSynchronizationDetailsResponseDTO): State => {
      if (synchronizationStatus.accessStatus?.error) {
        this.updateAccessError(this.handleAccessError(synchronizationStatus.accessStatus.error));
      } else {
        this.updateAccessError(undefined);
      }

      return {
        ...state,
        synchronizationStatus,
      };
    }
  );

  private updateAccessError = this.updater(
    (state, accessError: string | undefined): State => ({ ...state, accessError })
  );

  private updateIsLoadingConnectionStatus = this.updater(
    (state, isLoadingConnectionStatus: boolean): State => ({ ...state, isLoadingConnectionStatus })
  );

  public getSynchronizationStatus = this.effect(() =>
    this.store.select(selectOrganizationUuid).pipe(
      tap(() => this.updateIsLoadingConnectionStatus(true)),
      filterNullish(),
      mergeMap((organizationUuid) =>
        this.apiService
          .getSingleStsOrganizationSynchronizationInternalV2GetSynchronizationStatus({ organizationUuid })
          .pipe(
            tapResponse(
              (synchronizationStatus: APIStsOrganizationSynchronizationDetailsResponseDTO) =>
                this.updateSynchronizationStatus(synchronizationStatus),
              (e) => {
                console.error(e);
                this.updateAccessError(this.defaultErrorMessage);
              },
              () => this.updateIsLoadingConnectionStatus(false)
            )
          )
      )
    )
  );
}
