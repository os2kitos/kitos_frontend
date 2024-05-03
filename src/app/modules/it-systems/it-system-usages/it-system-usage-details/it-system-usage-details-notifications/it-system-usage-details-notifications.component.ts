import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectITSystemUsageHasModifyPermission, selectItSystemUsageUuid } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-it-system-usage-details-notifications',
  templateUrl: './it-system-usage-details-notifications.component.html',
  styleUrls: ['./it-system-usage-details-notifications.component.scss']
})
export class ItSystemUsageDetailsNotificationsComponent extends BaseComponent {
  public readonly systemUsageUuid$ = this.store.select(selectItSystemUsageUuid).pipe(filterNullish());
  public hasModifyPermission$ = this.store.select(selectITSystemUsageHasModifyPermission).pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
