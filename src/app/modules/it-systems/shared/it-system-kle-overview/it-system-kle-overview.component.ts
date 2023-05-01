import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { selectItSystemKleUuids, selectItSystemLoading } from 'src/app/store/it-system/selectors';
import { AvailableKleCommands } from '../kle-table/kle-table.component';

@Component({
  selector: 'app-it-system-kle-overview',
  templateUrl: './it-system-kle-overview.component.html',
  styleUrls: ['./it-system-kle-overview.component.scss'],
})
export class ItSystemKleOverviewComponent extends BaseComponent {
  public readonly loadingSystemContextKle$ = this.store.select(selectItSystemLoading);
  public readonly systemContextKleUuids$ = this.store.select(selectItSystemKleUuids).pipe(filterNullish());
  public readonly anyInherited$ = this.systemContextKleUuids$.pipe(matchNonEmptyArray());
  @Input() public availableCommands: Array<AvailableKleCommands> = [];

  constructor(private readonly store: Store) {
    super();
  }
}
