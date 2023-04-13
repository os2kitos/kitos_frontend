import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemUsageUuid } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-it-system-usage-details-roles',
  templateUrl: './it-system-usage-details-roles.component.html',
  styleUrls: ['./it-system-usage-details-roles.component.scss'],
})
export class ItSystemUsageDetailsRolesComponent extends BaseComponent {
  public readonly systemUuid$ = this.store.select(selectItSystemUsageUuid).pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
