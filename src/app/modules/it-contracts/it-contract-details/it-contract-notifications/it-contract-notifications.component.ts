import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractHasModifyPermissions, selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
@Component({
  selector: 'app-it-contract-notifications',
  templateUrl: './it-contract-notifications.component.html',
  styleUrl: './it-contract-notifications.component.scss'
})
export class ItContractNotificationsComponent extends BaseComponent {
  public readonly contractUuid$ = this.store.select(selectItContractUuid).pipe(filterNullish());
  public hasModifyPermission$ = this.store.select(selectItContractHasModifyPermissions).pipe(filterNullish());
  public readonly organizationUuid$ = this.store.select(selectOrganizationUuid).pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
