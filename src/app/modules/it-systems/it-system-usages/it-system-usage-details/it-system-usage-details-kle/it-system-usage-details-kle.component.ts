import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';

@Component({
  selector: 'app-it-system-usage-details-kle',
  templateUrl: './it-system-usage-details-kle.component.html',
  styleUrls: ['./it-system-usage-details-kle.component.scss'],
})
export class ItSystemUsageDetailsKleComponent extends BaseComponent {
  constructor(private readonly store: Store) {
    super();
  }
}
