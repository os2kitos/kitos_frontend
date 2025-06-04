import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectITSystemUsageHasModifyPermission } from 'src/app/store/it-system-usage/selectors';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { ExternalReferencesManagementComponent } from '../../../../../shared/components/external-references-management/external-references-management.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-it-system-usage-details-external-references',
  templateUrl: './it-system-usage-details-external-references.component.html',
  styleUrls: ['./it-system-usage-details-external-references.component.scss'],
  imports: [CardComponent, CardHeaderComponent, ExternalReferencesManagementComponent, AsyncPipe],
})
export class ItSystemUsageDetailsExternalReferencesComponent extends BaseComponent {
  public readonly hasModifyPermission$ = this.store
    .select(selectITSystemUsageHasModifyPermission)
    .pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
