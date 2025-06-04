import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItContractHasModifyPermissions, selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { NotificationsTableComponent } from '../../../../shared/components/notifications-table/notifications-table.component';

@Component({
  selector: 'app-it-contract-notifications',
  templateUrl: './it-contract-notifications.component.html',
  styleUrl: './it-contract-notifications.component.scss',
  imports: [CardComponent, CardHeaderComponent, NgIf, NotificationsTableComponent, AsyncPipe],
})
export class ItContractNotificationsComponent extends BaseComponent {
  public readonly contractUuid$ = this.store.select(selectItContractUuid).pipe(filterNullish());
  public readonly hasModifyPermission$ = this.store.select(selectItContractHasModifyPermissions).pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
