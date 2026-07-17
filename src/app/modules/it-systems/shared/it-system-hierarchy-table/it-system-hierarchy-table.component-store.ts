import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';

import { Observable, mergeMap, tap } from 'rxjs';
import { APIItSystemHierarchyNodeResponseDTO, ItSystemInternalV2Service } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  loading: boolean;
  hierarchy?: Array<APIItSystemHierarchyNodeResponseDTO>;
}

@Injectable()
export class ItSystemHierarchyTableComponentStore extends ComponentStore<State> {
  public readonly hierarchy$ = this.select((state) => state.hierarchy).pipe(filterNullish());
  public readonly isLoading$ = this.select((state) => state.loading).pipe(filterNullish());

  constructor(
    private store: Store,
    @Inject(ItSystemInternalV2Service) private apiItSystemService: ItSystemInternalV2Service,
  ) {
    super({ loading: false });
  }

  private updateHierarchy = this.updater(
    (state, hierarchy: Array<APIItSystemHierarchyNodeResponseDTO>): State => ({
      ...state,
      hierarchy,
    }),
  );

  private updateIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    }),
  );

  public getHierarchy = this.effect((itSystemUuid$: Observable<string>) =>
    itSystemUuid$.pipe(
      tap(() => this.updateIsLoading(true)),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([systemUuid, organizationUuid]) => {
        return this.apiItSystemService.getManyItSystemInternalV2GetHierarchy({ organizationUuid, systemUuid }).pipe(
          tapResponse({
            next: (hierarchy) => this.updateHierarchy(hierarchy),
            error: (e) => console.error(e),
            complete: () => this.updateIsLoading(false),
          }),
        );
      }),
    ),
  );
}
