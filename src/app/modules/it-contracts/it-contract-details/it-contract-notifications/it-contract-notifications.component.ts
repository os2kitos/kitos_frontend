import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractHasModifyPermissions, selectItContractUuid } from 'src/app/store/it-contract/selectors';

@Component({
  selector: 'app-it-contract-notifications',
  templateUrl: './it-contract-notifications.component.html',
  styleUrl: './it-contract-notifications.component.scss'
})
export class ItContractNotificationsComponent extends BaseComponent {
  public readonly contractUuid$ = this.store.select(selectItContractUuid).pipe(filterNullish());
  public readonly hasModifyPermission$ = this.store.select(selectItContractHasModifyPermissions).pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
