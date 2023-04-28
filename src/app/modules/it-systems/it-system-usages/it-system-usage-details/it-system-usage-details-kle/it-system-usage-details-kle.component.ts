import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageLocallyAddedKleUuids,
} from 'src/app/store/it-system-usage/selectors';

@Component({
  selector: 'app-it-system-usage-details-kle',
  templateUrl: './it-system-usage-details-kle.component.html',
  styleUrls: ['./it-system-usage-details-kle.component.scss'],
})
export class ItSystemUsageDetailsKleComponent extends BaseComponent {
  public hasModifyPermission$ = this.store.select(selectITSystemUsageHasModifyPermission);
  public readonly localKleUuids$ = this.store.select(selectItSystemUsageLocallyAddedKleUuids).pipe(filterNullish());
  public readonly anyLocalKleUuids$ = this.store
    .select(selectItSystemUsageLocallyAddedKleUuids)
    .pipe(filterNullish(), matchNonEmptyArray());

  constructor(private readonly store: Store) {
    super();
  }

  public onAddNew() {
    //TODO
  }
}
