import { Component, Input, OnInit } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { BehaviorSubject, combineLatest, first, map, merge, Observable } from 'rxjs';
import { APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { RoleOptionTypes } from '../models/options/role-option-types.model';
import { RoleOptionTypeTexts } from '../models/options/role-option-texts.model';
import { Store } from '@ngrx/store';
import { RoleOptionTypeActions } from 'src/app/store/roles-option-type-store/actions';
import { selectHasValidCache, selectRoleOptionTypesDictionary } from 'src/app/store/roles-option-type-store/selectors';
import { filterNullish } from '../pipes/filter-nullish';
import { RoleTableComponentStore } from '../components/role-table/role-table.component-store';
import { RoleAssignmentActions } from 'src/app/store/role-assignment/actions';
import { Actions, ofType } from '@ngrx/effects';
import { RoleOptionTypeService } from '../services/role-option-type.service';
import { ConfirmActionCategory, ConfirmActionService } from '../services/confirm-action.service';
import { IRoleAssignment } from '../models/helpers/read-model-role-assignments';
import { RoleTableCreateDialogComponent } from '../components/role-table/role-table.create-dialog/role-table.create-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  template: '',
})
export abstract class BaseRoleTableComponent extends BaseComponent implements OnInit {
  @Input() public entityType!: RoleOptionTypes;
  @Input() public hasModifyPermission!: boolean;
  @Input() public entityUuid$!: Observable<string>;

  public entityName = '';

  constructor(
    protected store: Store,
    protected componentStore: RoleTableComponentStore,
    protected actions$: Actions,
    protected roleOptionTypeService: RoleOptionTypeService,
    protected confirmationService: ConfirmActionService,
    protected dialog: MatDialog
  ) {
    super();
  }

  public availableRolesDictionary$ = new BehaviorSubject<Dictionary<APIRoleOptionResponseDTO> | undefined>(undefined);

  public readonly availableRolesLoading = this.availableRolesDictionary$.pipe(
    map((availableRoles) => {
      return availableRoles ? false : true;
    })
  );

  public readonly isLoading$ = combineLatest([
    this.componentStore.rolesIsLoading$,
    this.store.select(selectHasValidCache(this.entityType)),
    this.availableRolesLoading,
  ]).pipe(
    map(([isLoading, hasInvalidCache, availableRolesLoading]) => isLoading || hasInvalidCache || availableRolesLoading)
  );

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
        this.entityUuid$
      ).subscribe(() => {
        this.getRoles();
      })
    );
  }

  public onRemove(role: IRoleAssignment) {
    this.confirmationService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil fjerne tildelingen af rollen "${role.assignment.role.name}" til brugeren "${role.assignment.user.name}"?`,
      onConfirm: () => this.roleOptionTypeService.dispatchRemoveEntityRoleAction(role, this.entityType),
    });
  }

  protected getRoles() {
    this.entityUuid$.pipe(first()).subscribe((entityUuid) => {
      this.componentStore.getRolesByEntityUuid({ entityUuid, entityType: this.entityType });
    });
  }

  protected openAddNewDialog(userRoles: IRoleAssignment[], entityUuid: string) {
    const dialogRef = this.dialog.open(RoleTableCreateDialogComponent);
    dialogRef.componentInstance.userRoles = userRoles;
    dialogRef.componentInstance.entityType = this.entityType;
    dialogRef.componentInstance.entityUuid = entityUuid;
    dialogRef.componentInstance.title = $localize`Tilføj ${this.entityName.toLocaleLowerCase()}`;
  }
}
