import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectItSystemUsageContextSystemUuid } from 'src/app/store/it-system-usage/selectors';
import { AsyncPipe } from '@angular/common';
import { ItSystemInterfacesTableComponent } from '../../../shared/it-system-interfaces-table/it-system-interfaces-table.component';

@Component({
  selector: 'app-it-system-usage-details-interfaces',
  templateUrl: './it-system-usage-details-interfaces.component.html',
  styleUrls: ['./it-system-usage-details-interfaces.component.scss'],
  imports: [ItSystemInterfacesTableComponent, AsyncPipe],
})
export class ItSystemUsageDetailsInterfacesComponent extends BaseComponent {
  public readonly systemUuid$ = this.store.select(selectItSystemUsageContextSystemUuid);

  constructor(private store: Store) {
    super();
  }
}
