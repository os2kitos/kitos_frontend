import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';import { tapResponse } from '@ngrx/operators';

import { Store } from '@ngrx/store';
import { Observable, combineLatestWith, mergeMap, tap } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APIV2DataProcessingRegistrationInternalINTERNALService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectDataProcessingUuid } from 'src/app/store/data-processing/selectors';

interface State {
  loading: boolean;
  systemUsages?: Array<APIIdentityNamePairResponseDTO>;
}
@Injectable()
export class CreateDprSystemUsageDialogComponentStore extends ComponentStore<State> {
  public readonly systemUsages$ = this.select((state) => state.systemUsages).pipe(filterNullish());
  public readonly isLoading$ = this.select((state) => state.loading);

  constructor(private store: Store, private dprApiService: APIV2DataProcessingRegistrationInternalINTERNALService) {
    super({ loading: false });
  }

  private updateSystemUsages = this.updater(
    (state, systemUsages: Array<APIIdentityNamePairResponseDTO>): State => ({
      ...state,
      systemUsages,
    })
  );

  private updateIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  public getSystemUsages = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.updateIsLoading(true)),
      combineLatestWith(this.store.select(selectDataProcessingUuid).pipe(filterNullish())),
      mergeMap(([search, dprUuid]) => {
        this.updateIsLoading(true);
        return this.dprApiService
          .getManyDataProcessingRegistrationInternalV2GetAvailableSystemUsages({ dprUuid, nameQuery: search })
          .pipe(
            tapResponse(
              (organizations) => this.updateSystemUsages(organizations),
              (e) => console.error(e),
              () => this.updateIsLoading(false)
            )
          );
      })
    )
  );
}
