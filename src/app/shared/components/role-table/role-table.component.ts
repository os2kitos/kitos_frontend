import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, combineLatestWith, filter, first, map, merge, Observable, of } from 'rxjs';
import { APIOrganizationUnitRolesResponseDTO, APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { RoleAssignmentActions } from 'src/app/store/role-assignment/actions';
import { RoleOptionTypeActions } from 'src/app/store/roles-option-type-store/actions';
import { selectHasValidCache, selectRoleOptionTypesDictionary } from 'src/app/store/roles-option-type-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { RoleOptionTypeTexts } from '../../models/options/role-option-texts.model';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { invertBooleanValue } from '../../pipes/invert-boolean-value';
import { matchEmptyArray } from '../../pipes/match-empty-array';
import { ConfirmActionCategory, ConfirmActionService } from '../../services/confirm-action.service';
import { RoleOptionTypeService } from '../../services/role-option-type.service';
import { RoleTableComponentStore } from './role-table.component-store';
import { RoleTableCreateDialogComponent } from './role-table.create-dialog/role-table.create-dialog.component';
import { IRoleAssignment } from '../../models/helpers/read-model-role-assignments';
import { concatLatestFrom } from '@ngrx/operators';

@Component({
  selector: 'app-role-table[entityUuid][entityType][hasModifyPermission]',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.scss'],
  providers: [RoleTableComponentStore],
})
export class RoleTableComponent extends BaseComponent implements OnInit {
  @Input() public entityUuid!: Observable<string>;
  @Input() public entityType!: RoleOptionTypes;
  @Input() public hasModifyPermission!: boolean;
  @Input() public currentUnitName$!: Observable<string>;
  @Input() public rolesFilter: (assignments: Observable<IRoleAssignment[]>) => Observable<IRoleAssignment[]> = (
    assignments
  ) => {
    console.log("dummy function");
    return assignments;
  };
  public entityName = '';

  public availableRolesDictionary$ = new BehaviorSubject<Dictionary<APIRoleOptionResponseDTO> | undefined>(undefined);

  public readonly availableRolesLoading = this.availableRolesDictionary$.pipe(
    map((availableRoles) => {
      return availableRoles ? false : true;
    })
  );

  public readonly roles$ = this.rolesFilter(this.componentStore.roles$);
  public readonly isLoading$ = combineLatest([
    this.componentStore.rolesIsLoading$,
    this.store.select(selectHasValidCache(this.entityType)),
    this.availableRolesLoading,
  ]).pipe(
    map(([isLoading, hasInvalidCache, availableRolesLoading]) => isLoading || hasInvalidCache || availableRolesLoading)
  );
  public readonly anyRoles$ = this.roles$.pipe(matchEmptyArray(), invertBooleanValue());

  constructor(
    private readonly store: Store,
    @Inject(RoleTableComponentStore)
    private readonly componentStore: RoleTableComponentStore,
    private readonly roleOptionTypeService: RoleOptionTypeService,
    private readonly dialog: MatDialog,
    private readonly actions$: Actions,
    private readonly confirmationService: ConfirmActionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.entityName = RoleOptionTypeTexts[this.entityType].name;
    //get role options (in order to get description and write access)
    this.store.dispatch(RoleOptionTypeActions.getOptions(this.entityType));

    this.subscriptions.add(
      this.store
        .select(selectRoleOptionTypesDictionary(this.entityType))
        .pipe(filterNullish())
        .subscribe((roles) => {
          this.availableRolesDictionary$.next(roles);
        })
    );

    //get roles
    this.getRoles();

    //on role add/remove or uuid changes update the list
    this.subscriptions.add(
      merge(
        this.actions$.pipe(ofType(RoleAssignmentActions.addRoleSuccess, RoleAssignmentActions.removeRoleSuccess)),
        this.entityUuid
      ).subscribe(() => {
        this.getRoles();
      })
    );
  }

  public onAddNew() {
    this.subscriptions.add(
      this.roles$.pipe(combineLatestWith(this.entityUuid), first()).subscribe(([userRoles, entityUuid]) => {
        const dialogRef = this.dialog.open(RoleTableCreateDialogComponent);
        dialogRef.componentInstance.userRoles = userRoles;
        dialogRef.componentInstance.entityType = this.entityType;
        dialogRef.componentInstance.entityUuid = entityUuid;
        dialogRef.componentInstance.title = $localize`Tilføj ${this.entityName.toLocaleLowerCase()}`;
      })
    );
  }

  public onRemove(role: IRoleAssignment) {
    this.confirmationService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil fjerne tildelingen af rollen "${role.assignment.role.name}" til brugeren "${role.assignment.user.name}"?`,
      onConfirm: () =>
        this.roleOptionTypeService.dispatchRemoveEntityRoleAction(
          role.assignment.user.uuid,
          role.assignment.role.uuid,
          this.entityType
        ),
    });
  }

  private getRoles() {
    this.entityUuid.pipe(first()).subscribe((entityUuid) => {
      this.componentStore.getRolesByEntityUuid({ entityUuid, entityType: this.entityType });
    });
  }

  public orgUnitValue(role: IRoleAssignment): string {
    console.log(role);
    return (role as APIOrganizationUnitRolesResponseDTO).organizationUnitName ?? '';
  }
}
