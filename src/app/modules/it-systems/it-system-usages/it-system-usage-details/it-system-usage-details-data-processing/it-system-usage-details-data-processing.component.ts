import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
import { selectItSystemUsageUuid } from 'src/app/store/it-system-usage/selectors';
import { ItSystemUsageDetailsDataProcessingComponentStore } from './it-system-usage-details-data-processing.component-store';

@Component({
  selector: 'app-it-system-usage-details-data-processing',
  templateUrl: './it-system-usage-details-data-processing.component.html',
  styleUrls: ['./it-system-usage-details-data-processing.component.scss'],
  providers: [ItSystemUsageDetailsDataProcessingComponentStore],
})
export class ItSystemUsageDetailsDataProcessingComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.dataProcessingComponentStore.associatedDataProcessingRegistrationsIsLoading$;
  public readonly dataProcessingRegistrations$ =
    this.dataProcessingComponentStore.associatedDataProcessingRegistrations$;

  public readonly anyRegistrations$ = this.dataProcessingRegistrations$.pipe(matchEmptyArray(), invertBooleanValue());

  constructor(
    private readonly store: Store,
    private readonly dataProcessingComponentStore: ItSystemUsageDetailsDataProcessingComponentStore
  ) {
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageUuid)
        .pipe(filterNullish())
        .subscribe((itSystemUsageUuid) =>
          this.dataProcessingComponentStore.getAssociatedDataProcessingRegistrations(itSystemUsageUuid)
        )
    );
  }
}
