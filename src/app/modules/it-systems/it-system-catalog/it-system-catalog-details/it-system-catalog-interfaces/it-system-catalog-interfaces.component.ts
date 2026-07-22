import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectItSystemUuid } from 'src/app/store/it-system/selectors';
import { AsyncPipe } from '@angular/common';
import { ItSystemInterfacesTableComponent } from '../../../shared/it-system-interfaces-table/it-system-interfaces-table.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-it-system-catalog-interfaces',
  templateUrl: './it-system-catalog-interfaces.component.html',
  styleUrl: './it-system-catalog-interfaces.component.scss',
  imports: [ItSystemInterfacesTableComponent, LoadingComponent, AsyncPipe],
})
export class ItSystemCatalogInterfacesComponent extends BaseComponent {
  public readonly systemUuid$ = this.store.select(selectItSystemUuid);

  constructor(private readonly store: Store) {
    super();
  }
}
