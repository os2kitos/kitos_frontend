import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';import { tapResponse } from '@ngrx/operators';

import { Observable, mergeMap } from 'rxjs';
import {
  APIRegistrationHierarchyNodeWithActivationStatusResponseDTO,
  APIV2ItContractInternalINTERNALService,
} from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

interface State {
  loading: boolean;
  hierarchy?: Array<APIRegistrationHierarchyNodeWithActivationStatusResponseDTO>;
}

@Injectable()
export class ItContractHierarchyComponentStore extends ComponentStore<State> {
  public readonly hierarchy$ = this.select((state) => state.hierarchy).pipe(filterNullish());
  public readonly isLoading$ = this.select((state) => state.loading);

  constructor(private apiItContractInternalService: APIV2ItContractInternalINTERNALService) {
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

  public getHierarchy = this.effect((itContractUuid$: Observable<string>) =>
    itContractUuid$.pipe(
      mergeMap((uuid) => {
        this.updateIsLoading(true);
        return this.apiItContractInternalService.getManyItContractInternalV2GetHierarchy({ contractUuid: uuid }).pipe(
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
