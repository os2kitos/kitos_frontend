import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectITSystemHasModifyPermission } from 'src/app/store/it-system/selectors';

@Component({
  selector: 'app-it-system-catalog-references',
  templateUrl: './it-system-catalog-references.component.html',
  styleUrl: './it-system-catalog-references.component.scss',
})
export class ItSystemCatalogReferencesComponent extends BaseComponent {
  public readonly hasModifyPermission$ = this.store.select(selectITSystemHasModifyPermission).pipe(filterNullish());

  constructor(private readonly store: Store) {
    super();
  }
}
