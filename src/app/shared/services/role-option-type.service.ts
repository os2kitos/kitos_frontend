import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  APIExtendedRoleAssignmentResponseDTO,
  APIRoleOptionResponseDTO,
  APIV2ItSystemUsageInternalINTERNALService,
  APIV2ItSystemUsageRoleTypeService,
} from 'src/app/api/v2';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { RoleOptionTypes } from '../models/options/role-option-types.model';

@Injectable({
  providedIn: 'root',
})
export class RoleOptionTypeService {
  constructor(
    private readonly store: Store,
    private readonly systemUsageRoleService: APIV2ItSystemUsageRoleTypeService,
    private readonly internalUsageService: APIV2ItSystemUsageInternalINTERNALService
  ) {}

  private resolveGetRoleOptionsEndpoints(
    optionType: RoleOptionTypes
  ): (organizationUuid: string) => Observable<Array<APIRoleOptionResponseDTO>> {
    switch (optionType) {
      case 'it-system-usage':
        return (organizationUuid: string) =>
          this.systemUsageRoleService.getManyItSystemUsageRoleTypeV2Get({ organizationUuid });
    }
  }

  private resolveGetEntityRolesEndpoints(
    entityType: RoleOptionTypes
  ): (entityUuid: string) => Observable<Array<APIExtendedRoleAssignmentResponseDTO>> {
    switch (entityType) {
      case 'it-system-usage':
        return (entityUuid: string) =>
          this.internalUsageService.getManyItSystemUsageInternalV2GetAddRoleAssignments({
            systemUsageUuid: entityUuid,
          });
    }
  }

  /**
   * Returns options available within the provided type
   * @param organizationUuid uuid of the entity
   * @param optionType type of regular option
   */
  public getAvailableOptions(
    organizationUuid: string,
    optionType: RoleOptionTypes
  ): Observable<Array<APIRoleOptionResponseDTO>> {
    return this.resolveGetRoleOptionsEndpoints(optionType)(organizationUuid);
  }

  public getEntityRoles(entityUuid: string, entityType: RoleOptionTypes) {
    return this.resolveGetEntityRolesEndpoints(entityType)(entityUuid);
  }

  public dispatchRemoveEntityRoleAction(userUuid: string, roleUuid: string, entityType: RoleOptionTypes) {
    switch (entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.removeItSystemUsageRole(userUuid, roleUuid));
        break;
    }
  }

  public dispatchAddEntityRoleAction(userUuid: string, roleUuid: string, entityType: RoleOptionTypes) {
    switch (entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.addItSystemUsageRole(userUuid, roleUuid));
        break;
    }
  }
}
