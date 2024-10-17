import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, map, Observable, Subscription } from 'rxjs';
import {
  APIExtendedRoleAssignmentResponseDTO,
  APIOrganizationUnitRolesResponseDTO,
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
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import { RoleAssignmentActions } from 'src/app/store/role-assignment/actions';
import { IRoleAssignment, mapDTOsToRoleAssignment } from '../models/helpers/read-model-role-assignments';
import { selectItSystemUsageUuid } from 'src/app/store/it-system-usage/selectors';
import { filterNullish } from '../pipes/filter-nullish';
import { selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { selectDataProcessingUuid } from 'src/app/store/data-processing/selectors';
import { RoleOptionTypes } from '../models/options/role-option-types.model';

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
            DataProcessingActions.addDataProcessingRoleSuccess,
            OrganizationUnitActions.addOrganizationUnitRoleSuccess
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
            DataProcessingActions.removeDataProcessingRoleSuccess,
            OrganizationUnitActions.deleteOrganizationUnitRoleSuccess
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
  ): (
    entityUuid: string
  ) => Observable<Array<APIExtendedRoleAssignmentResponseDTO | APIOrganizationUnitRolesResponseDTO>> {
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
        return (entityUuid: string) =>
          this.organizationUnitInternalService.getManyOrganizationUnitsInternalV2GetRoleAssignments({
            organizationUuid,
            organizationUnitUuid: entityUuid,
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

  public getEntityRoles(
    entityUuid: string,
    entityType: RoleOptionTypes,
    organizationUuid: string
  ): Observable<Array<IRoleAssignment>> {
    return this.resolveGetEntityRolesEndpoints(
      entityType,
      organizationUuid
    )(entityUuid).pipe(map((roles) => roles.map(mapDTOsToRoleAssignment)));
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
        this.store.dispatch(OrganizationUnitActions.addOrganizationUnitRole(userUuid, roleUuid));
        break;
    }
  }

  public dispatchRemoveEntityRoleAction(role: IRoleAssignment, entityType: RoleOptionTypes) {
    const userUuid = role.assignment.user.uuid;
    const roleUuid = role.assignment.role.uuid;
    switch (entityType) {
      case 'it-system-usage':
        this.store
          .select(selectItSystemUsageUuid)
          .pipe(filterNullish(), first())
          .subscribe((itSystemUuid) => {
            this.store.dispatch(ITSystemUsageActions.removeItSystemUsageRole(userUuid, roleUuid, itSystemUuid));
          });
        break;
      case 'it-contract':
        this.store
          .select(selectItContractUuid)
          .pipe(filterNullish(), first())
          .subscribe((itContractUuid) => {
            this.store.dispatch(ITContractActions.removeItContractRole(userUuid, roleUuid, itContractUuid));
          });
        break;
      case 'data-processing':
        this.store
          .select(selectDataProcessingUuid)
          .pipe(filterNullish(), first())
          .subscribe((dataProcessingUuid) => {
            this.store.dispatch(DataProcessingActions.removeDataProcessingRole(userUuid, roleUuid, dataProcessingUuid));
          });
        break;
      case 'organization-unit':
        if (!role.unitUuid) throw Error('Unit uuid is required for deleting organization unit role');
        this.store.dispatch(OrganizationUnitActions.deleteOrganizationUnitRole(userUuid, roleUuid, role.unitUuid));
        break;
    }
  }
}
