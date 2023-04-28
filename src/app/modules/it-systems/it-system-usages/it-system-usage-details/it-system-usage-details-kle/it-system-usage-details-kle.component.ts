import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { selectItSystemKleWithDetails, selectItSystemLoading } from 'src/app/store/it-system/selectors';
import { KLEActions } from 'src/app/store/kle/actions';

@Component({
  selector: 'app-it-system-usage-details-kle',
  templateUrl: './it-system-usage-details-kle.component.html',
  styleUrls: ['./it-system-usage-details-kle.component.scss'],
})
export class ItSystemUsageDetailsKleComponent extends BaseComponent implements OnInit {
  public readonly inheritedkle$ = this.store.select(selectItSystemKleWithDetails).pipe(filterNullish());
  public readonly loadingInerited$ = this.store.select(selectItSystemLoading).pipe(filterNullish());

  //TODO: Also check on the state of loading kle store
  public readonly anyInherited$ = this.inheritedkle$.pipe(filterNullish(), matchNonEmptyArray());

  constructor(private readonly store: Store) {
    super();
  }

  ngOnInit(): void {
    //Load KLE options
    this.store.dispatch(KLEActions.getKles());
  }
}
