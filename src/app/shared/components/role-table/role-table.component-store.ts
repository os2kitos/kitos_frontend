import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, mergeMap } from 'rxjs';
import { APIExtendedRoleAssignmentResponseDTO, APIV2ItSystemUsageInternalINTERNALService } from 'src/app/api/v2';
import { filterNullish } from '../../pipes/filter-nullish';

interface State {
  loading: boolean;
  roles?: Array<APIExtendedRoleAssignmentResponseDTO>;
}

@Injectable()
export class RoleTableComponentStore extends ComponentStore<State> {
  public readonly roles$ = this.select((state) => state.roles).pipe(filterNullish());

  public readonly rolesIsLoading$ = this.select((state) => state.loading).pipe(filterNullish());

  constructor(private readonly apiUsageService: APIV2ItSystemUsageInternalINTERNALService) {
    super({ loading: false });
  }

  private updateInterfaces = this.updater(
    (state, roles: Array<APIExtendedRoleAssignmentResponseDTO>): State => ({
      ...state,
      roles,
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
      mergeMap((exposedBySystemUuid) => {
        this.updateItInterfacesIsLoading(true);
        return this.apiInterfaceService
          .getManyItInterfaceV2GetItInterfaces({ exposedBySystemUuid, includeDeactivated: true })
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
