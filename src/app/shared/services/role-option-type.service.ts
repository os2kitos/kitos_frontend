import { Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  APIExtendedRoleAssignmentResponseDTO,
  APIRoleOptionResponseDTO,
  APIV2DataProcessingRegistrationInternalINTERNALService,
  APIV2DataProcessingRegistrationRoleTypeService,
  APIV2ItContractInternalINTERNALService,
  APIV2ItContractRoleTypeService,
  APIV2ItSystemUsageInternalINTERNALService,
  APIV2ItSystemUsageRoleTypeService
} from 'src/app/api/v2';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
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
    private readonly actions$: Actions,
    private readonly contractRolesService: APIV2ItContractRoleTypeService,
    private readonly contractInternalService: APIV2ItContractInternalINTERNALService,
    private readonly dataprocessingRolesService: APIV2DataProcessingRegistrationRoleTypeService,
    private readonly dataprocessingInternalService: APIV2DataProcessingRegistrationInternalINTERNALService
  ) { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public subscribeOnActions() {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.addItSystemUsageRoleSuccess, ITContractActions.addItContractRoleSuccess))
        .subscribe(() => this.dispatchAddSuccess())
    );
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(ITSystemUsageActions.removeItSystemUsageRoleSuccess, ITContractActions.removeItContractRoleSuccess)
        )
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
      case 'it-contract':
        return (organizationUuid: string) =>
          this.contractRolesService.getManyItContractRoleTypeV2Get({ organizationUuid });
      case 'data-processing':
        return (organizationUuid: string) =>
          this.dataprocessingRolesService.getManyDataProcessingRegistrationRoleTypeV2Get({ organizationUuid });
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
      case 'it-contract':
        return (entityUuid: string) =>
          this.contractInternalService.getManyItContractInternalV2GetAddRoleAssignments({
            contractUuid: entityUuid,
          });
      case 'data-processing':
        return (entityUuid: string) =>
          this.dataprocessingInternalService.getManyDataProcessingRegistrationInternalV2GetAddRoleAssignments({
            dprUuid: entityUuid,
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
      case 'it-contract':
        this.store.dispatch(ITContractActions.removeItContractRole(userUuid, roleUuid));
        break;
      case 'data-processing':
        this.store.dispatch(DataProcessingActions.removeDataProcessingRole(userUuid, roleUuid));
        break;
    }
  }

  public dispatchAddEntityRoleAction(userUuid: string, roleUuid: string, entityType: RoleOptionTypes) {
    switch (entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.addItSystemUsageRole(userUuid, roleUuid));
        break;
      case 'it-contract':
        this.store.dispatch(ITContractActions.addItContractRole(userUuid, roleUuid));
        break;
      case 'data-processing':
        this.store.dispatch(DataProcessingActions.addDataProcessingRole(userUuid, roleUuid));
        break;
    }
  }
}
