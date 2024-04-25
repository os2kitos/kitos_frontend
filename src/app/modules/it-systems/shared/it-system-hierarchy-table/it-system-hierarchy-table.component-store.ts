import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, mergeMap } from 'rxjs';
import { APIRegistrationHierarchyNodeWithActivationStatusResponseDTO, APIV2ItSystemService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

interface State {
  loading: boolean;
  hierarchy?: Array<APIRegistrationHierarchyNodeWithActivationStatusResponseDTO>;
}

@Injectable()
export class ItSystemHierarchyTableComponentStore extends ComponentStore<State> {
  public readonly hierarchy$ = this.select((state) => state.hierarchy).pipe(filterNullish());
  public readonly isLoading$ = this.select((state) => state.loading).pipe(filterNullish());

  constructor(private apiItSystemService: APIV2ItSystemService) {
    super({ loading: false });
  }

  private updateHierarchy = this.updater(
    (state, hierarchy: Array<APIRegistrationHierarchyNodeWithActivationStatusResponseDTO>): State => ({
      ...state,
      hierarchy,
    })
  );

  private updateIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  public getHierarchy = this.effect((itSystemUuid$: Observable<string>) =>
    itSystemUuid$.pipe(
      mergeMap((uuid) => {
        this.updateIsLoading(true);
        return this.apiItSystemService.getManyItSystemV2GetHierarchyByUuid({ uuid }).pipe(
          tapResponse(
            (hierarchy) => this.updateHierarchy(hierarchy),
            (e) => console.error(e),
            () => this.updateIsLoading(false)
          )
        );
      })
    )
  );
}
