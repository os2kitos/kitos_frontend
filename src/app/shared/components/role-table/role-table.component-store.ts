import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, mergeMap } from 'rxjs';
import { APIExtendedRoleAssignmentResponseDTO, APIV2ItSystemUsageInternalINTERNALService } from 'src/app/api/v2';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';

interface State {
  loading: boolean;
  roles?: Array<APIExtendedRoleAssignmentResponseDTO>;
}

export interface RoleTableParameters {
  entityUuid$: Observable<string>;
  optionType: RoleOptionTypes;
}

@Injectable()
export class RoleTableComponentStore extends ComponentStore<State> {
  public readonly roles$ = this.select((state) => state.roles).pipe(filterNullish());
  public readonly rolesIsLoading$ = this.select((state) => state.loading).pipe(filterNullish());

  constructor(private readonly apiUsageService: APIV2ItSystemUsageInternalINTERNALService) {
    super({ loading: false });
  }

  private updateRoles = this.updater(
    (state, roles: Array<APIExtendedRoleAssignmentResponseDTO>): State => ({
      ...state,
      roles,
    })
  );

  private updateRolesIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  public getRolesByEntityUuid = this.effect((entityUuid$: Observable<string>) =>
    entityUuid$.pipe(
      mergeMap((uuid) => {
        this.updateRolesIsLoading(true);
        return this.apiUsageService
          .getManyItSystemUsageInternalV2GetAddRoleAssignments({
            systemUsageUuid: uuid,
          })
          .pipe(
            tapResponse(
              (roles) => this.updateRoles(roles),
              (e) => console.error(e),
              () => this.updateRolesIsLoading(false)
            )
          );
      })
    )
  );
}
