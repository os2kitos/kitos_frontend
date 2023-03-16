import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ItSystemUsageDetailsContractsComponentStore } from './it-system-usage-details-contracts.component-store';

@Component({
  templateUrl: 'it-system-usage-details-contracts.component.html',
  styleUrls: ['it-system-usage-details-contracts.component.scss'],
  providers: [ItSystemUsageDetailsContractsComponentStore],
})
export class ITSystemUsageDetailsContractsComponent {
  constructor(
    private readonly store: Store,
    private readonly contractsStore: ItSystemUsageDetailsContractsComponentStore
  ) {}
}
