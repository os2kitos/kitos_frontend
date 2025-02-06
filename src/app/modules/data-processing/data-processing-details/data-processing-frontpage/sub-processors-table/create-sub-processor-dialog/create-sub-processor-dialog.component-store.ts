import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';import { tapResponse } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { Observable, combineLatestWith, mergeMap, tap } from 'rxjs';
import { APIOrganizationResponseDTO, APIV2DataProcessingRegistrationInternalINTERNALService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectDataProcessingUuid } from 'src/app/store/data-processing/selectors';

interface State {
  loading: boolean;
  organizations?: Array<APIOrganizationResponseDTO>;
}
@Injectable()
export class CreateSubProcessorDialogComponentStore extends ComponentStore<State> {
  public readonly organizations$ = this.select((state) => state.organizations).pipe(filterNullish());
  public readonly isLoading$ = this.select((state) => state.loading);

  constructor(private store: Store, private dprApiService: APIV2DataProcessingRegistrationInternalINTERNALService) {
    super({ loading: false });
  }

  private updateOrganizations = this.updater(
    (state, organizations: Array<APIOrganizationResponseDTO>): State => ({
      ...state,
      organizations,
    })
  );

  private updateIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  public getOrganizations = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.updateIsLoading(true)),
      combineLatestWith(this.store.select(selectDataProcessingUuid).pipe(filterNullish())),
      mergeMap(([search, dprUuid]) => {
        this.updateIsLoading(true);
        return this.dprApiService
          .getManyDataProcessingRegistrationInternalV2GetAvailableSubDataProcessors({ dprUuid, nameQuery: search })
          .pipe(
            tapResponse(
              (organizations) => this.updateOrganizations(organizations),
              (e) => console.error(e),
              () => this.updateIsLoading(false)
            )
          );
      })
    )
  );
}
