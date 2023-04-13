import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RoleOptionTypeActions } from 'src/app/store/roles-option-type-store/actions';
import {
  selectRoleOptionTypes,
  selectRoleOptionTypesDictionary,
} from 'src/app/store/roles-option-type-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { RoleTableComponentStore } from './role-table.component-store';

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

  public readonly availableRolesDictionary$ = this.store
    .select(selectRoleOptionTypesDictionary(this.optionType))
    .pipe(filterNullish());

  public readonly roles$ = this.componentStore.roles$;
  public readonly rolesLoading$ = this.componentStore.rolesIsLoading$;

  constructor(private store: Store, private componentStore: RoleTableComponentStore) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RoleOptionTypeActions.getOptions(this.optionType));

    this.componentStore.getRolesByEntityUuid(this.entityUuid$);
  }
}
