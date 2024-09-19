import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
import { invertBooleanValue } from '../../pipes/invert-boolean-value';
import { matchEmptyArray } from '../../pipes/match-empty-array';
import { ConfirmActionService } from '../../services/confirm-action.service';
import { RoleOptionTypeService } from '../../services/role-option-type.service';
import { RoleTableComponentStore } from './role-table.component-store';
import * as _ from 'lodash';
import { BaseRoleTableComponent } from '../../base/base-role-table.component';

@Component({
  selector: 'app-role-table[entityType][hasModifyPermission]',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.scss'],
  providers: [RoleTableComponentStore],
})

export class RoleTableComponent extends BaseRoleTableComponent implements OnInit {

  public readonly roles$ = this.componentStore.roles$;

  public readonly anyRoles$ = this.roles$.pipe(matchEmptyArray(), invertBooleanValue());

  constructor(
    override readonly store: Store,
    override readonly componentStore: RoleTableComponentStore,
    override readonly roleOptionTypeService: RoleOptionTypeService,
    override readonly dialog: MatDialog,
    override readonly actions$: Actions,
    override readonly confirmationService: ConfirmActionService
  ) {
    super(store, componentStore, actions$, roleOptionTypeService, confirmationService, dialog);
  }

  public onAddNew() {
    this.subscriptions.add(
      this.roles$.pipe(combineLatestWith(this.entityUuid$), first()).subscribe(([userRoles, entityUuid]) => {
        this.openAddNewDialog(userRoles, entityUuid);
      })
    );
  }
}
