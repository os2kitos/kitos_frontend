import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  templateUrl: 'it-system-usage-details-frontpage.component.html',
  styleUrls: ['it-system-usage-details-frontpage.component.scss'],
})
export class ITSystemUsageDetailsFrontpageComponent {
  constructor(private route: ActivatedRoute, private store: Store) {}
}
