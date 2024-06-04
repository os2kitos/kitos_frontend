import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { selectDataProcessingHasModifyPermissions, selectDataProcessingOversightDates } from 'src/app/store/data-processing/selectors';

@Component({
  selector: 'app-oversights-table',
  templateUrl: './oversights-table.component.html',
  styleUrl: './oversights-table.component.scss'
})
export class OversightsTableComponent extends BaseComponent {
  public readonly oversightDates$ = this.store.select(selectDataProcessingOversightDates).pipe(filterNullish());
  public readonly anyOversightDates$ = this.oversightDates$.pipe(matchNonEmptyArray());
  public readonly hasModifyPermissions$ = this.store.select(selectDataProcessingHasModifyPermissions);

  constructor(private store: Store, private dialog: MatDialog) {
    super();
  }
}
