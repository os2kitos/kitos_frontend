import { Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  APIExtendedRoleAssignmentResponseDTO,
  APIRoleOptionResponseDTO,
  APIV2ItSystemUsageInternalINTERNALService,
  APIV2ItSystemUsageRoleTypeService,
} from 'src/app/api/v2';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { RoleAssignmentActions } from 'src/app/store/role-assignment/actions';
import { RoleOptionTypes } from '../models/options/role-option-types.model';

@Injectable({
  providedIn: 'root',
})
export class RoleOptionTypeService implements OnDestroy {
  public subscriptions = new Subscription();

  constructor(
    private readonly store: Store,
    private readonly systemUsageRoleService: APIV2ItSystemUsageRoleTypeService,
    private readonly internalUsageService: APIV2ItSystemUsageInternalINTERNALService,
    private readonly actions$: Actions
  ) {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public subscribeOnActions() {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageRoleSuccess))
        .subscribe(() => this.dispatchAddSuccess())
    );
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.removeItSystemUsageRoleSuccess))
        .subscribe(() => this.dispatchRemoveSuccess())
    );
  }

  private dispatchAddSuccess() {
    this.store.dispatch(RoleAssignmentActions.addRoleSuccess());
  }

  private dispatchRemoveSuccess() {
    this.store.dispatch(RoleAssignmentActions.removeRoleSuccess());
  }

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
