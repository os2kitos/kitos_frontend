import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectItSystemUsageContextSystemUuid } from 'src/app/store/it-system-usage/selectors';
import { AsyncPipe } from '@angular/common';
import { ItSystemHierarchyTableComponent } from '../../../shared/it-system-hierarchy-table/it-system-hierarchy-table.component';

@Component({
  selector: 'app-it-system-usage-details-hierarchy',
  templateUrl: './it-system-usage-details-hierarchy.component.html',
  styleUrls: ['./it-system-usage-details-hierarchy.component.scss'],
  imports: [ItSystemHierarchyTableComponent, AsyncPipe],
})
export class ItSystemUsageDetailsHierarchyComponent extends BaseComponent {
  public readonly systemUuid$ = this.store.select(selectItSystemUsageContextSystemUuid).pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
