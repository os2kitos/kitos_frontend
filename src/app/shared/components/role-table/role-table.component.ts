import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, first, map } from 'rxjs';
import { APIExtendedRoleAssignmentResponseDTO, APIRoleOptionResponseDTO } from 'src/app/api/v2';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { RoleOptionTypeActions } from 'src/app/store/roles-option-type-store/actions';
import { selectHasValidCache, selectRoleOptionTypesDictionary } from 'src/app/store/roles-option-type-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { mapObsoleteValue } from '../../helpers/obsolete-option.helpers';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { invertBooleanValue } from '../../pipes/invert-boolean-value';
import { matchEmptyArray } from '../../pipes/match-empty-array';
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
  public tableName = '';

  public availableRolesDictionary$?: Observable<Dictionary<APIRoleOptionResponseDTO>>;

  public readonly roles$ = this.componentStore.roles$;
  public readonly isLoading$ = combineLatest([
    this.componentStore.rolesIsLoading$,
    this.store.select(selectHasValidCache(this.entityType)),
  ]).pipe(map(([isLoading, hasInvalidCache]) => isLoading || hasInvalidCache));
  public readonly anyRoles$ = this.roles$.pipe(matchEmptyArray(), invertBooleanValue());

  constructor(
    private readonly store: Store,
    private readonly componentStore: RoleTableComponentStore,
    private readonly dialog: MatDialog,
    private readonly actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    switch (this.entityType) {
      case 'it-system-usage':
        this.tableName = $localize`systemroller`;
        break;
    }

    //get role options (in order to get description and write access)
    this.store.dispatch(RoleOptionTypeActions.getOptions(this.entityType));
    this.availableRolesDictionary$ = this.store
      .select(selectRoleOptionTypesDictionary(this.entityType))
      .pipe(filterNullish());

    //get roles
    this.getRoles();

    //on role add/remove update the list
    this.actions$
      .pipe(
        ofType(ITSystemUsageActions.addItSystemUsageRoleSuccess, ITSystemUsageActions.removeItSystemUsageRoleSuccess)
      )
      .subscribe(() => {
        this.getRoles();
      });
  }

  public onAddNew() {
    this.roles$.pipe(first()).subscribe((userRoles) => {
      const dialogRef = this.dialog.open(RoleTableCreateDialogComponent);
      dialogRef.componentInstance.userRoles = userRoles;
      dialogRef.componentInstance.optionType = this.entityType;
      dialogRef.componentInstance.entityUuid = this.entityUuid;
      switch (this.entityType) {
        case 'it-system-usage':
          dialogRef.componentInstance.title = $localize`Tilføj systemrolle`;
      }
    });
  }

  public onRemove(role: APIExtendedRoleAssignmentResponseDTO) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialog = dialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialog.bodyText = $localize`Er du sikker på at du vil fjerne tildelingen af rollen "${role.role.name}" til brugeren "${role.user.name}"?`;
    confirmationDialog.confirmColor = 'warn';
    confirmationDialog.declineColor = 'accent';

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        switch (this.entityType) {
          case 'it-system-usage':
            this.store.dispatch(ITSystemUsageActions.removeItSystemUsageRole(role.user.uuid, role.role.uuid));
            break;
        }
      }
    });
  }

  public mapRoleObsoleteValue(
    role: APIExtendedRoleAssignmentResponseDTO,
    availableValues: Dictionary<APIRoleOptionResponseDTO>
  ): string {
    return mapObsoleteValue(role.role.uuid, role.role.name, availableValues);
  }

  private getRoles() {
    this.componentStore.getRolesByEntityUuid({ entityUuid: this.entityUuid, entityType: this.entityType });
  }
}
