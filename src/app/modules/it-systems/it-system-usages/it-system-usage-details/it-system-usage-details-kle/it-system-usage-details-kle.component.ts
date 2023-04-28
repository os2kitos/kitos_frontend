import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { selectItSystemKleWithDetails, selectItSystemLoading } from 'src/app/store/it-system/selectors';
import { KLEActions } from 'src/app/store/kle/actions';
import { selectHasValidCache } from 'src/app/store/kle/selectors';

@Component({
  selector: 'app-it-system-usage-details-kle',
  templateUrl: './it-system-usage-details-kle.component.html',
  styleUrls: ['./it-system-usage-details-kle.component.scss'],
})
export class ItSystemUsageDetailsKleComponent extends BaseComponent implements OnInit {
  private readonly loadingSystemContext$ = this.store.select(selectItSystemLoading);
  private readonly loadingKle$ = this.store.select(selectHasValidCache).pipe(invertBooleanValue());
  public readonly systemContextKleDetails$ = this.store.select(selectItSystemKleWithDetails).pipe(filterNullish());
  public readonly loadingSystemContextKle$ = combineLatest([this.loadingSystemContext$, this.loadingKle$]).pipe(
    map(([loadingInerited, loadingKleDetails]) => loadingInerited || loadingKleDetails)
  );

  public readonly anyInherited$ = this.systemContextKleDetails$.pipe(filterNullish(), matchNonEmptyArray());

  constructor(private readonly store: Store) {
    super();
  }

  ngOnInit(): void {
    //Load KLE options
    this.store.dispatch(KLEActions.getKles());
  }
}
