import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  templateUrl: 'it-system-usage-details-contracts.component.html',
  styleUrls: ['it-system-usage-details-contracts.component.scss'],
})
export class ITSystemUsageDetailsContractsComponent {
  constructor(private route: ActivatedRoute, private store: Store) {}
}
