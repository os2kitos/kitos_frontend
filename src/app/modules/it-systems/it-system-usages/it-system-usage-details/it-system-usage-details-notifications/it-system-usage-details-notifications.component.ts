import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageUuid,
} from 'src/app/store/it-system-usage/selectors';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { AsyncPipe } from '@angular/common';
import { NotificationsTableComponent } from '../../../../../shared/components/notifications-table/notifications-table.component';

@Component({
  selector: 'app-it-system-usage-details-notifications',
  templateUrl: './it-system-usage-details-notifications.component.html',
  styleUrls: ['./it-system-usage-details-notifications.component.scss'],
  imports: [CardComponent, CardHeaderComponent, NotificationsTableComponent, AsyncPipe],
})
export class ItSystemUsageDetailsNotificationsComponent extends BaseComponent {
  public readonly systemUsageUuid$ = this.store.select(selectItSystemUsageUuid).pipe(filterNullish());
  public hasModifyPermission$ = this.store.select(selectITSystemUsageHasModifyPermission).pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
