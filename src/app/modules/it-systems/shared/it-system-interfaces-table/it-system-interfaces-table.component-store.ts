import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';

import { Observable, mergeMap } from 'rxjs';
import { APIItInterfaceResponseDTO, APIV2ItInterfaceService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  loading: boolean;
  itInterfaces?: Array<APIItInterfaceResponseDTO>;
}

@Injectable()
export class ItSystemInterfacesTableComponentStore extends ComponentStore<State> {
  public readonly itInterfaces$ = this.select((state) => state.itInterfaces).pipe(filterNullish());

  public readonly itInterfacesIsLoading$ = this.select((state) => state.loading).pipe(filterNullish());

  constructor(private store: Store, private apiInterfaceService: APIV2ItInterfaceService) {
    super({ loading: false });
  }

  private updateInterfaces = this.updater(
    (state, itInterfaces: Array<APIItInterfaceResponseDTO>): State => ({
      ...state,
      itInterfaces,
    })
  );

  private updateItInterfacesIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  public getInterfacesExposedBySystemWithUuid = this.effect((itSystemUuid$: Observable<string>) =>
    itSystemUuid$.pipe(
      concatLatestFrom(() => this.store.select(selectOrganizationUuid)),
      mergeMap(([exposedBySystemUuid, organizationUuid]) => {
        this.updateItInterfacesIsLoading(true);
        return this.apiInterfaceService
          .getManyItInterfaceV2GetItInterfaces({
            exposedBySystemUuid: exposedBySystemUuid,
            usedInOrganizationUuid: organizationUuid,
            includeDeactivated: true,
            orderByProperty: 'Name',
            availableInOrganizationUuid: organizationUuid,
          })
          .pipe(
            tapResponse(
              (itInterfaces) => this.updateInterfaces(itInterfaces),
              (e) => console.error(e),
              () => this.updateItInterfacesIsLoading(false)
            )
          );
      })
    )
  );
}
