import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RoleOptionTypeActions } from 'src/app/store/roles-option-type-store/actions';
import {
  selectRoleOptionTypes,
  selectRoleOptionTypesDictionary,
} from 'src/app/store/roles-option-type-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { RoleOptionTypes } from '../../models/options/role-option-types.model';
import { filterNullish } from '../../pipes/filter-nullish';

@Component({
  selector: 'app-role-table[optionType]',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.scss'],
  //providers: [RoleTableComponentStore]
})
export class RoleTableComponent extends BaseComponent implements OnInit {
  @Input() public optionType: RoleOptionTypes = 'it-system-usage';

  public readonly availableRoles$ = this.store.select(selectRoleOptionTypes(this.optionType)).pipe(filterNullish());

  public readonly availableRolesDictionary$ = this.store
    .select(selectRoleOptionTypesDictionary(this.optionType))
    .pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(RoleOptionTypeActions.getOptions(this.optionType));
  }
}
