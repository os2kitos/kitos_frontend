import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first, map, Observable, Subscription } from 'rxjs';
import {
  APIExtendedRoleAssignmentResponseDTO,
  APIOrganizationUnitRolesResponseDTO,
  APIRoleOptionResponseDTO,
  DataProcessingRegistrationInternalV2Service,
  DataProcessingRegistrationRoleTypeV2Service,
  ItContractInternalV2Service,
  ItContractRoleTypeV2Service,
  ItSystemUsageInternalV2Service,
  ItSystemUsageRoleTypeV2Service,
  OrganizationUnitRoleTypeV2Service,
  OrganizationUnitsInternalV2Service,
} from 'src/app/api/v2';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { selectDataProcessingUuid } from 'src/app/store/data-processing/selectors';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { selectItSystemUsageUuid } from 'src/app/store/it-system-usage/selectors';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import { selectCurrentUnitUuid } from 'src/app/store/organization/organization-unit/selectors';
import { RoleAssignmentActions } from 'src/app/store/role-assignment/actions';
import { RoleOptionTypeActions } from 'src/app/store/roles-option-type-store/actions';
import { mapDTOsToRoleAssignment, RoleAssignment } from '../models/helpers/read-model-role-assignments';
import { RoleOptionTypes } from '../models/options/role-option-types.model';
import { filterNullish } from '../pipes/filter-nullish';

@Injectable({
  providedIn: 'root',
})
export class RoleOptionTypeService implements OnDestroy {
  public subscriptions = new Subscription();

  constructor(
    private readonly store: Store,
    @Inject(ItSystemUsageRoleTypeV2Service)
    private readonly systemUsageRoleService: ItSystemUsageRoleTypeV2Service,
    @Inject(ItSystemUsageInternalV2Service)
    private readonly internalUsageService: ItSystemUsageInternalV2Service,
    private readonly actions$: Actions,
    @Inject(ItContractRoleTypeV2Service)
    private readonly contractRolesService: ItContractRoleTypeV2Service,
    @Inject(ItContractInternalV2Service)
    private readonly contractInternalService: ItContractInternalV2Service,
    @Inject(DataProcessingRegistrationRoleTypeV2Service)
    private readonly dataprocessingRolesService: DataProcessingRegistrationRoleTypeV2Service,
    @Inject(DataProcessingRegistrationInternalV2Service)
    private readonly dataprocessingInternalService: DataProcessingRegistrationInternalV2Service,
    @Inject(OrganizationUnitsInternalV2Service)
    private readonly organizationUnitInternalService: OrganizationUnitsInternalV2Service,
    @Inject(OrganizationUnitRoleTypeV2Service)
    private readonly organizationUnitRolesService: OrganizationUnitRoleTypeV2Service,
  ) {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public subscribeOnActions() {
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.bulkAddItSystemUsageRoleSuccess,
            ITContractActions.bulkAddItContractRoleSuccess,
            DataProcessingActions.bulkAddDataProcessingRoleSuccess,
            OrganizationUnitActions.bulkAddOrganizationUnitRoleSuccess,
          ),
        )
        .subscribe(() => this.dispatchAddSuccess()),
    );
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.removeItSystemUsageRoleSuccess,
            ITContractActions.removeItContractRoleSuccess,
            DataProcessingActions.removeDataProcessingRoleSuccess,
            OrganizationUnitActions.deleteOrganizationUnitRoleSuccess,
          ),
        )
        .subscribe(() => this.dispatchRemoveSuccess()),
    );
  }

  private dispatchAddSuccess() {
    this.store.dispatch(RoleAssignmentActions.addRoleSuccess());
  }

  private dispatchRemoveSuccess() {
    this.store.dispatch(RoleAssignmentActions.removeRoleSuccess());
  }

  private resolveGetRoleOptionsEndpoints(
    optionType: RoleOptionTypes,
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
    organizationUuid: string,
  ): (
    entityUuid: string,
  ) => Observable<Array<APIExtendedRoleAssignmentResponseDTO | APIOrganizationUnitRolesResponseDTO>> {
    switch (entityType) {
      case 'it-system-usage':
        return (entityUuid: string) =>
          this.internalUsageService.getManyItSystemUsageInternalV2GetRoleAssignments({
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
    optionType: RoleOptionTypes,
  ): Observable<Array<APIRoleOptionResponseDTO>> {
    return this.resolveGetRoleOptionsEndpoints(optionType)(organizationUuid);
  }

  public dispatchAllGetAvailableOptions() {
    this.store.dispatch(RoleOptionTypeActions.getOptions('data-processing'));
    this.store.dispatch(RoleOptionTypeActions.getOptions('it-contract'));
    this.store.dispatch(RoleOptionTypeActions.getOptions('it-system-usage'));
    this.store.dispatch(RoleOptionTypeActions.getOptions('organization-unit'));
  }

  public getEntityRoles(
    entityUuid: string,
    entityType: RoleOptionTypes,
    organizationUuid: string,
  ): Observable<Array<RoleAssignment>> {
    return this.resolveGetEntityRolesEndpoints(
      entityType,
      organizationUuid,
    )(entityUuid).pipe(map((roles) => roles.map(mapDTOsToRoleAssignment)));
  }

  public dispatchAddEntityRoleAction(
    userUuids: string[],
    roleUuid: string,
    entityType: RoleOptionTypes,
    unitUuid?: string,
  ) {
    switch (entityType) {
      case 'it-system-usage':
        this.store.dispatch(ITSystemUsageActions.bulkAddItSystemUsageRole(userUuids, roleUuid));
        break;
      case 'it-contract':
        this.store.dispatch(ITContractActions.bulkAddItContractRole(userUuids, roleUuid));
        break;
      case 'data-processing':
        this.store.dispatch(DataProcessingActions.bulkAddDataProcessingRole(userUuids, roleUuid));
        break;
      case 'organization-unit':
        if (unitUuid) {
          this.store.dispatch(OrganizationUnitActions.bulkAddOrganizationUnitRole(userUuids, roleUuid, unitUuid));
        } else {
          this.store
            .select(selectCurrentUnitUuid)
            .pipe(filterNullish(), first())
            .subscribe((currentUnitUuid) =>
              this.store.dispatch(
                OrganizationUnitActions.bulkAddOrganizationUnitRole(userUuids, roleUuid, currentUnitUuid),
              ),
            );
        }
        break;
    }
  }

  public dispatchRemoveEntityRoleAction(role: RoleAssignment, entityType: RoleOptionTypes) {
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
        if (!role.unitUuid) throw new Error('Unit uuid is required for deleting organization unit role');
        this.store.dispatch(OrganizationUnitActions.deleteOrganizationUnitRole(userUuid, roleUuid, role.unitUuid));
        break;
    }
  }
}
