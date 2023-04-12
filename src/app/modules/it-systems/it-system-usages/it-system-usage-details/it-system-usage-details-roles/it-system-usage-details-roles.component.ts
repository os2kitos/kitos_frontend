import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectItSystemUsageUuid } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-it-system-usage-details-roles',
  templateUrl: './it-system-usage-details-roles.component.html',
  styleUrls: ['./it-system-usage-details-roles.component.scss'],
})
export class ItSystemUsageDetailsRolesComponent extends BaseComponent {
  public readonly systemUuid$ = this.store.select(selectItSystemUsageUuid);

  constructor(private store: Store) {
    super();
  }
}
