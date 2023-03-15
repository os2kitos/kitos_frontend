import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
import { selectItSystemUsage } from 'src/app/store/it-system-usage/selectors';
import { ItSystemUsageDetailsDataProcessingComponentStore } from './it-system-usage-details-data-processing.component-store';

@Component({
  selector: 'app-it-system-usage-details-data-processing',
  templateUrl: './it-system-usage-details-data-processing.component.html',
  styleUrls: ['./it-system-usage-details-data-processing.component.scss'],
  providers: [ItSystemUsageDetailsDataProcessingComponentStore]
})
export class ItSystemUsageDetailsDataProcessingComponent extends BaseComponent implements OnInit {
  readonly dataProcessingRegistrations$ = this.dataProcessingComponentStore.associatedDataProcessingRegistrations$;
  readonly anyRegistrations$ = this
    .dataProcessingRegistrations$
    .pipe(matchEmptyArray())
    .pipe(map((isEmpty) => !isEmpty));

  constructor(private store: Store, private dataProcessingComponentStore: ItSystemUsageDetailsDataProcessingComponentStore) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsage)
        .pipe(filterNullish())
        .subscribe((itSystemUsage) =>
          this.dataProcessingComponentStore.getAssociatedDataProcessingRegistrations(itSystemUsage.uuid)
        )
    );
  }
}
