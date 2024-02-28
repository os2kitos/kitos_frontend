import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { selectItSystemUuid } from 'src/app/store/it-system/selectors';

@Component({
  selector: 'app-it-system-catalog-interfaces',
  templateUrl: './it-system-catalog-interfaces.component.html',
  styleUrl: './it-system-catalog-interfaces.component.scss',
})
export class ItSystemCatalogInterfacesComponent extends BaseComponent {
  public readonly systemUuid$ = this.store.select(selectItSystemUuid);

  constructor(private readonly store: Store) {
    super();
  }
}
