import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { selectItSystemUsageUuid } from 'src/app/store/it-system-usage/selectors';
import { ItSystemUsageDetailsDataProcessingComponentStore } from './it-system-usage-details-data-processing.component-store';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { DetailsPageLinkComponent } from '../../../../../shared/components/details-page-link/details-page-link.component';
import { StatusChipComponent } from '../../../../../shared/components/status-chip/status-chip.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-states/empty-state.component';

@Component({
  selector: 'app-it-system-usage-details-data-processing',
  templateUrl: './it-system-usage-details-data-processing.component.html',
  styleUrls: ['./it-system-usage-details-data-processing.component.scss'],
  providers: [ItSystemUsageDetailsDataProcessingComponentStore],
  imports: [
    CardComponent,
    CardHeaderComponent,
    NgIf,
    LoadingComponent,
    NativeTableComponent,
    NgFor,
    DetailsPageLinkComponent,
    StatusChipComponent,
    EmptyStateComponent,
    AsyncPipe,
  ],
})
export class ItSystemUsageDetailsDataProcessingComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.dataProcessingComponentStore.associatedDataProcessingRegistrationsIsLoading$;
  public readonly dataProcessingRegistrations$ =
    this.dataProcessingComponentStore.associatedDataProcessingRegistrations$;

  public readonly anyRegistrations$ = this.dataProcessingRegistrations$.pipe(matchNonEmptyArray());

  constructor(
    private readonly store: Store,
    private readonly dataProcessingComponentStore: ItSystemUsageDetailsDataProcessingComponentStore,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageUuid)
        .pipe(filterNullish())
        .subscribe((itSystemUsageUuid) =>
          this.dataProcessingComponentStore.getAssociatedDataProcessingRegistrations(itSystemUsageUuid),
        ),
    );
  }
}
