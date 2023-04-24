import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { combineLatest, first, map } from 'rxjs';
import { APIExtendedRoleAssignmentResponseDTO, APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { RoleOptionTypeActions } from 'src/app/store/roles-option-type-store/actions';
import { selectHasValidCache, selectRoleOptionTypesDictionary } from 'src/app/store/roles-option-type-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { RoleOptionTypeTexts } from '../../models/options/role-option-texts.model';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { invertBooleanValue } from '../../pipes/invert-boolean-value';
import { matchEmptyArray } from '../../pipes/match-empty-array';
import { RoleOptionTypeService } from '../../services/role-option-type.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { RoleTableComponentStore } from './role-table.component-store';
import { RoleTableCreateDialogComponent } from './role-table.create-dialog/role-table.create-dialog.component';

@Component({
  selector: 'app-role-table[entityUuid][entityType][hasModifyPermission]',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.scss'],
  providers: [RoleTableComponentStore],
})
export class RoleTableComponent extends BaseComponent implements OnInit {
  @Input() public entityUuid!: string;
  @Input() public entityType!: RoleOptionTypes;
  @Input() public hasModifyPermission!: boolean;
  public entityName = '';

  public availableRolesDictionary: Dictionary<APIRoleOptionResponseDTO> | null = null;

  public readonly roles$ = this.componentStore.roles$;
  public readonly isLoading$ = combineLatest([
    this.componentStore.rolesIsLoading$,
    this.store.select(selectHasValidCache(this.entityType)),
  ]).pipe(map(([isLoading, hasInvalidCache]) => isLoading || hasInvalidCache || !this.availableRolesDictionary));
  public readonly anyRoles$ = this.roles$.pipe(matchEmptyArray(), invertBooleanValue());

  constructor(
    private readonly store: Store,
    private readonly componentStore: RoleTableComponentStore,
    private readonly roleOptionTypeService: RoleOptionTypeService,
    private readonly dialog: MatDialog,
    private readonly actions$: Actions
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
          this.availableRolesDictionary = roles;
        })
    );

    //get roles
    this.getRoles();

    //on role add/remove update the list
    this.actions$
      .pipe(ofType(RoleOptionTypeActions.addRoleSuccess, RoleOptionTypeActions.removeRoleSuccess))
      .subscribe(() => {
        this.getRoles();
      });
  }

  public onAddNew() {
    this.roles$.pipe(first()).subscribe((userRoles) => {
      const dialogRef = this.dialog.open(RoleTableCreateDialogComponent);
      dialogRef.componentInstance.userRoles = userRoles;
      dialogRef.componentInstance.entityType = this.entityType;
      dialogRef.componentInstance.entityUuid = this.entityUuid;
      dialogRef.componentInstance.title = $localize`Tilføj ${this.entityName.toLocaleLowerCase()}`;
    });
  }

  public onRemove(role: APIExtendedRoleAssignmentResponseDTO) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialog = dialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialog.bodyText = $localize`Er du sikker på at du vil fjerne tildelingen af rollen "${role.role.name}" til brugeren "${role.user.name}"?`;
    confirmationDialog.confirmColor = 'warn';

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.roleOptionTypeService.dispatchRemoveEntityRoleAction(role.user.uuid, role.role.uuid, this.entityType);
      }
    });
  }

  private getRoles() {
    this.componentStore.getRolesByEntityUuid({ entityUuid: this.entityUuid, entityType: this.entityType });
  }
}
