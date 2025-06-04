import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectITSystemHasModifyPermission } from 'src/app/store/it-system/selectors';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { ExternalReferencesManagementComponent } from '../../../../../shared/components/external-references-management/external-references-management.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-it-system-catalog-references',
  templateUrl: './it-system-catalog-references.component.html',
  styleUrl: './it-system-catalog-references.component.scss',
  imports: [CardComponent, CardHeaderComponent, ExternalReferencesManagementComponent, AsyncPipe],
})
export class ItSystemCatalogReferencesComponent extends BaseComponent {
  public readonly hasModifyPermission$ = this.store.select(selectITSystemHasModifyPermission).pipe(filterNullish());

  constructor(private readonly store: Store) {
    super();
  }
}
