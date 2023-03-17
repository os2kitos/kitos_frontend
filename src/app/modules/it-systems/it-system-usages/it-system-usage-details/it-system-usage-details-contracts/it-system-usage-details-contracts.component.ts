import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { selectItSystemUsageUuid } from 'src/app/store/it-system-usage/selectors';
import { ItSystemUsageDetailsContractsComponentStore } from './it-system-usage-details-contracts.component-store';

@Component({
  templateUrl: 'it-system-usage-details-contracts.component.html',
  styleUrls: ['it-system-usage-details-contracts.component.scss'],
  providers: [ItSystemUsageDetailsContractsComponentStore],
})
export class ITSystemUsageDetailsContractsComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.contractsStore.associatedContractsIsLoading$;
  public readonly contracts$ = this.contractsStore.associatedContracts$;
  public readonly anyContracts$ = this.contracts$.pipe(matchNonEmptyArray());
  constructor(
    private readonly store: Store,
    private readonly contractsStore: ItSystemUsageDetailsContractsComponentStore
  ) {
    super();
  }

  //TODO: Make view model to deal with the "Drift" column issue, so the view can just bind - OR put that info in the "store"

  public ngOnInit(): void {
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageUuid)
        .pipe(filterNullish())
        .subscribe((itSystemUsageUuid) => this.contractsStore.getAssociatedContracts(itSystemUsageUuid))
    );
  }
}
