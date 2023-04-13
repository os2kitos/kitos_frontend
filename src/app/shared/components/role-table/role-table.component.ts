import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map } from 'rxjs';
import { RoleOptionTypeActions } from 'src/app/store/roles-option-type-store/actions';
import {
  selectHasValidCache,
  selectRoleOptionTypes,
  selectRoleOptionTypesDictionary,
} from 'src/app/store/roles-option-type-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { RoleTableComponentStore } from './role-table.component-store';
import { RoleTableCreateDialogComponent } from './role-table.create-dialog/role-table.create-dialog.component';

@Component({
  selector: 'app-role-table',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.scss'],
  providers: [RoleTableComponentStore],
})
export class RoleTableComponent extends BaseComponent implements OnInit {
  @Input() public entityUuid$!: Observable<string>;
  @Input() public optionType!: RoleOptionTypes;

  public readonly availableRoles$ = this.store.select(selectRoleOptionTypes(this.optionType)).pipe(filterNullish());

  public readonly availableRolesDictionary$ = this.store.select(selectRoleOptionTypesDictionary(this.optionType));

  public readonly roles$ = this.componentStore.roles$;
  public readonly isLoading$ = combineLatest([
    this.componentStore.rolesIsLoading$,
    this.store.select(selectHasValidCache(this.optionType)),
  ]).pipe(map(([isLoading, hasCache]) => isLoading && hasCache));

  constructor(
    private readonly store: Store,
    private readonly componentStore: RoleTableComponentStore,
    private readonly dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RoleOptionTypeActions.getOptions(this.optionType));

    this.componentStore.getRolesByEntityUuid(this.entityUuid$);
  }

  public onAddNew() {
    this.dialog.open(RoleTableCreateDialogComponent);
  }
}
