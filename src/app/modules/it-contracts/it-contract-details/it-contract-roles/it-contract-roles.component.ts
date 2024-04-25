import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractHasModifyPermissions, selectItContractUuid } from 'src/app/store/it-contract/selectors';

@Component({
  selector: 'app-it-contract-roles',
  templateUrl: './it-contract-roles.component.html',
  styleUrl: './it-contract-roles.component.scss',
})
export class ItContractRolesComponent extends BaseComponent {
  public readonly contractUuid$ = this.store.select(selectItContractUuid).pipe(filterNullish());
  public hasModifyPermission$ = this.store.select(selectItContractHasModifyPermissions).pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
