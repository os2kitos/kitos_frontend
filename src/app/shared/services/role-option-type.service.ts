import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, map, Observable, Subscription } from 'rxjs';
import {
  APIExtendedRoleAssignmentResponseDTO,
  APIRoleOptionResponseDTO,
  APIV2DataProcessingRegistrationInternalINTERNALService,
  APIV2DataProcessingRegistrationRoleTypeService,
  APIV2ItContractInternalINTERNALService,
  APIV2ItContractRoleTypeService,
  APIV2ItSystemUsageInternalINTERNALService,
  APIV2ItSystemUsageRoleTypeService,
  APIV2OrganizationUnitRoleTypeService,
  APIV2OrganizationUnitsInternalINTERNALService,
} from 'src/app/api/v2';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { RoleAssignmentActions } from 'src/app/store/role-assignment/actions';
import { RoleOptionTypes } from '../models/options/role-option-types.model';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

@Injectable({
  providedIn: 'root',
})
export class RoleOptionTypeService implements OnDestroy {
  public subscriptions = new Subscription();

  constructor(
    private readonly store: Store,
    @Inject(APIV2ItSystemUsageRoleTypeService)
    private readonly systemUsageRoleService: APIV2ItSystemUsageRoleTypeService,
    @Inject(APIV2ItSystemUsageInternalINTERNALService)
    private readonly internalUsageService: APIV2ItSystemUsageInternalINTERNALService,
    private readonly actions$: Actions,
    @Inject(APIV2ItContractRoleTypeService)
    private readonly contractRolesService: APIV2ItContractRoleTypeService,
    @Inject(APIV2ItContractInternalINTERNALService)
    private readonly contractInternalService: APIV2ItContractInternalINTERNALService,
    @Inject(APIV2DataProcessingRegistrationRoleTypeService)
    private readonly dataprocessingRolesService: APIV2DataProcessingRegistrationRoleTypeService,
    @Inject(APIV2DataProcessingRegistrationInternalINTERNALService)
    private readonly dataprocessingInternalService: APIV2DataProcessingRegistrationInternalINTERNALService,
    @Inject(APIV2OrganizationUnitsInternalINTERNALService)
    private readonly organizationUnitInternalService: APIV2OrganizationUnitsInternalINTERNALService,
    @Inject(APIV2OrganizationUnitRoleTypeService)
    private readonly organizationUnitRolesService: APIV2OrganizationUnitRoleTypeService
  ) {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public subscribeOnActions() {
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageRoleSuccess,
            ITContractActions.addItContractRoleSuccess,
            DataProcessingActions.addDataProcessingRoleSuccess
          )
        )
        .subscribe(() => this.dispatchAddSuccess())
    );
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.removeItSystemUsageRoleSuccess,
            ITContractActions.removeItContractRoleSuccess,
            DataProcessingActions.removeDataProcessingRoleSuccess
          )
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
      case 'organization-unit':
        return (organizationUuid: string) =>
          this.organizationUnitRolesService.getManyOrganizationUnitRoleTypeV2Get({ organizationUuid });
    }
  }

  private resolveGetEntityRolesEndpoints(
    entityType: RoleOptionTypes,
    organizationUuid: string
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
      case 'organization-unit':
        let func = (entityUuid: string) =>
          this.organizationUnitInternalService.getManyOrganizationUnitsInternalV2GetRoleAssignments({
            organizationUuid,
            organizationUnitUuid: entityUuid,
          }).pipe(map(result => result.map(item => item.roleAssignment)));
          console.log("Organization UUID: " + organizationUuid);
          return func;
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

  public getEntityRoles(entityUuid: string, entityType: RoleOptionTypes, organizationUuid: string): Observable<Array<APIExtendedRoleAssignmentResponseDTO>> {
    return this.resolveGetEntityRolesEndpoints(entityType, organizationUuid)(entityUuid);
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
      case 'organization-unit':
        throw new Error('TODO');
    }
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
        case 'organization-unit':
          throw new Error('TODO');
    }
  }
}
