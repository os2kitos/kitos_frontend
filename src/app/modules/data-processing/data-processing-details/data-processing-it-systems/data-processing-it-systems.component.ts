import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import {
  selectDataProcessingHasModifyPermissions,
  selectDataProcessingSystems,
} from 'src/app/store/data-processing/selectors';

@Component({
  selector: 'app-data-processing-it-systems',
  templateUrl: './data-processing-it-systems.component.html',
  styleUrl: './data-processing-it-systems.component.scss',
})
export class DataProcessingItSystemsComponent extends BaseComponent {
  public readonly systemUsages$ = this.store.select(selectDataProcessingSystems).pipe(filterNullish());
  public readonly anySystemUsages$ = this.systemUsages$.pipe(matchNonEmptyArray());

  public readonly hasModifyPermissions$ = this.store.select(selectDataProcessingHasModifyPermissions);

  constructor(private store: Store) {
    super();
  }

  public onDeleteSystem(uuid: string) {}

  public onAddNewSystem() {}
}
