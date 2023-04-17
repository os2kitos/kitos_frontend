import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectItSystemUsageContextSystemUuid } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-it-system-usage-details-hierarchy',
  templateUrl: './it-system-usage-details-hierarchy.component.html',
  styleUrls: ['./it-system-usage-details-hierarchy.component.scss'],
})
export class ItSystemUsageDetailsHierarchyComponent extends BaseComponent {
  public readonly systemUuid$ = this.store.select(selectItSystemUsageContextSystemUuid);

  constructor(private store: Store) {
    super();
  }
}
