import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';

import { Observable, mergeMap, switchMap, tap } from 'rxjs';
import {
  APIRegistrationHierarchyNodeWithActivationStatusResponseDTO,
  APIV2ItContractInternalINTERNALService,
} from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITContractActions } from 'src/app/store/it-contract/actions';

interface State {
  loading: boolean;
  hierarchy?: Array<APIRegistrationHierarchyNodeWithActivationStatusResponseDTO>;
  subHierarchy?: Array<APIRegistrationHierarchyNodeWithActivationStatusResponseDTO>;
}

@Injectable()
export class ItContractHierarchyComponentStore extends ComponentStore<State> {
  public readonly hierarchy$ = this.select((state) => state.hierarchy).pipe(filterNullish());
  public readonly subHierarchy$ = this.select((state) => state.subHierarchy).pipe(filterNullish());
  public readonly isLoading$ = this.select((state) => state.loading);

  constructor(
    @Inject(APIV2ItContractInternalINTERNALService)
    private apiItContractInternalService: APIV2ItContractInternalINTERNALService,
    private store: Store,
  ) {
    super({ loading: false });
  }

  private updateHierarchy = this.updater(
    (state, hierarchy: Array<APIRegistrationHierarchyNodeWithActivationStatusResponseDTO>): State => ({
      ...state,
      hierarchy,
    }),
  );

  private updateSubHierarchy = this.updater(
    (state, subHierarchy: Array<APIRegistrationHierarchyNodeWithActivationStatusResponseDTO>): State => ({
      ...state,
      subHierarchy,
    }),
  );

  private updateIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    }),
  );

  public getHierarchy = this.effect((itContractUuid$: Observable<string>) =>
    itContractUuid$.pipe(
      mergeMap((uuid) => {
        this.updateIsLoading(true);
        return this.apiItContractInternalService.getManyItContractInternalV2GetHierarchy({ contractUuid: uuid }).pipe(
          tapResponse(
            (hierarchy) => this.updateHierarchy(hierarchy),
            (e) => console.error(e),
            () => this.updateIsLoading(false),
          ),
        );
      }),
    ),
  );

  public getSubHierarchy = this.effect((itContractUuid$: Observable<string>) =>
    itContractUuid$.pipe(
      mergeMap((uuid) => {
        this.updateIsLoading(true);
        return this.apiItContractInternalService
          .getManyItContractInternalV2GetSubHierarchy({ contractUuid: uuid })
          .pipe(
            tapResponse(
              (hierarchy) => this.updateSubHierarchy(hierarchy),
              (e) => console.error(e),
              () => this.updateIsLoading(false),
            ),
          );
      }),
    ),
  );

  public sendTransferRequest = this.effect(
    (request$: Observable<{ currentParentUuid: string; parentUuid: string | undefined; uuids: string[] }>) =>
      request$.pipe(
        tap(this.updateIsLoading(true)),
        switchMap((request) =>
          this.apiItContractInternalService
            .patchSingleItContractInternalV2TransferItContractRange({
              request: { contractUuids: request.uuids, parentUuid: request.parentUuid },
            })
            .pipe(
              tapResponse(
                () => {
                  this.store.dispatch(ITContractActions.transferContractsSuccess());
                  return this.getSubHierarchy(request.currentParentUuid);
                },
                (e) => {
                  console.error(e);
                  this.store.dispatch(ITContractActions.transferContractsError());
                },
                () => this.updateIsLoading(false),
              ),
            ),
        ),
      ),
  );
}
