import { Injectable, OnDestroy } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Observable, combineLatestWith, mergeMap, tap } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractUuid } from 'src/app/store/it-contract/selectors';

interface State {
  dataProcessingRegistrations?: Array<APIIdentityNamePairResponseDTO>;
  dataProcessingRegistrationsIsLoading: boolean;
}

@Injectable()
export class ItContractDataProcessingRegistrationsComponentStore extends ComponentStore<State> implements OnDestroy {
  public readonly dataProcessingRegistrations$ = this.select((state) => state.dataProcessingRegistrations).pipe(
    filterNullish()
  );
  public readonly dataProcessingRegistrationsIsLoading$ = this.select(
    (state) => state.dataProcessingRegistrationsIsLoading
  );

  constructor(private readonly store: Store) {
    super({ dataProcessingRegistrationsIsLoading: false });
  }

  private updateDataProcessingRegistrations = this.updater(
    (state, dataProcessingRegistrations: APIIdentityNamePairResponseDTO[]): State => ({
      ...state,
      dataProcessingRegistrations,
    })
  );

  private updateDataProcessingRegistrationsIsLoading = this.updater(
    (state, dataProcessingRegistrationsIsLoading: boolean): State => ({
      ...state,
      dataProcessingRegistrationsIsLoading,
    })
  );

  public searchDataProcessingRegistrations = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.updateDataProcessingRegistrationsIsLoading(true)),
      combineLatestWith(this.store.select(selectItContractUuid).pipe(filterNullish())),
      mergeMap(([search, contractUuid]) => {
        return this.systemUsageService
          .getManyItSystemUsageInternalV2GetItSystemUsages({
            contractUuid,
            systemNameContent: search,
          })
          .pipe(
            tapResponse(
              (dprs) => this.updateDataProcessingRegistrations(dprs),
              (e) => console.error(e),
              () => this.updateDataProcessingRegistrationsIsLoading(false)
            )
          );
      })
    )
  );
}
