import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectITSystemUsageHasModifyPermission } from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-it-system-usage-details-external-references',
  templateUrl: './it-system-usage-details-external-references.component.html',
  styleUrls: ['./it-system-usage-details-external-references.component.scss'],
})
export class ItSystemUsageDetailsExternalReferencesComponent extends BaseComponent {
  public hasModifyPermission$ = this.store.select(selectITSystemUsageHasModifyPermission).pipe(filterNullish());

  constructor(private store: Store) {
    super();
  }
}
