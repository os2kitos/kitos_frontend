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
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { RoleTableComponentStore } from './role-table.component-store';
import { RoleTableCreateDialogComponent } from './role-table.create-dialog/role-table.create-dialog.component';

@Component({
  selector: 'app-role-table[entityUuid][optionType]',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.scss'],
  providers: [RoleTableComponentStore],
})
export class RoleTableComponent extends BaseComponent implements OnInit {
  @Input() public entityUuid!: string;
  @Input() public optionType!: RoleOptionTypes;

  public tableName = '';

  public availableRolesDictionary$?: Observable<Dictionary<APIRoleOptionResponseDTO>>;

  public readonly roles$ = this.componentStore.roles$;
  public readonly isLoading$ = combineLatest([
    this.componentStore.rolesIsLoading$,
    this.store.select(selectHasValidCache(this.optionType)),
  ]).pipe(map(([isLoading, hasCache]) => isLoading && hasCache));

  constructor(
    private readonly store: Store,
    private readonly componentStore: RoleTableComponentStore,
    private readonly dialog: MatDialog,
    private readonly actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    switch (this.optionType) {
      case 'it-system-usage':
        this.tableName = 'systemroller';
        break;
    }

    //get role options (in order to get description and write access)
    this.store.dispatch(RoleOptionTypeActions.getOptions(this.optionType));
    this.availableRolesDictionary$ = this.store
      .select(selectRoleOptionTypesDictionary(this.optionType))
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
      dialogRef.componentInstance.optionType = this.optionType;
      dialogRef.componentInstance.entityUuid = this.entityUuid;
    });
  }

  public onRemove(role: APIExtendedRoleAssignmentResponseDTO) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialog = dialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialog.bodyText = $localize`Er du sikker på at du vil fjerne "${role.role.name}" fra listen over ${this.tableName}?`;
    confirmationDialog.confirmColor = 'warn';
    confirmationDialog.declineColor = 'accent';

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        switch (this.optionType) {
          case 'it-system-usage':
            this.store.dispatch(ITSystemUsageActions.removeItSystemUsageRole(role.user.uuid, role.role.uuid));
            break;
        }
      }
    });
  }

  private getRoles() {
    this.componentStore.getRolesByEntityUuid({ entityUuid: this.entityUuid, optionType: this.optionType });
  }
}
