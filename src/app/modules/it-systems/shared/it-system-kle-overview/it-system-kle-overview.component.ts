import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatestWith, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { selectItSystemKleUuids, selectItSystemLoading } from 'src/app/store/it-system/selectors';
import { KleCommandEventArgs, SelectedKle, SelectedKleCommand } from '../kle-table/kle-table.component';

@Component({
  selector: 'app-it-system-kle-overview',
  templateUrl: './it-system-kle-overview.component.html',
  styleUrls: ['./it-system-kle-overview.component.scss'],
})
export class ItSystemKleOverviewComponent extends BaseComponent implements OnInit {
  constructor(private readonly store: Store) {
    super();
  }

  @Input() public hasModifyPermission = false;
  @Input() public actionMode: 'add-remove' | 'toggle-on-off' | undefined;
  private readonly irrelevantKleUuidsSubject$ = new BehaviorSubject<Array<string> | undefined>(undefined);
  @Input() public irrelevantKleUuids$: Observable<Array<string>> | undefined;
  @Input() public mode: 'add-remove' | 'toggle-on-off' | 'none' = 'none';
  @Output() public kleCommandRequested = new EventEmitter<KleCommandEventArgs>();

  public readonly loadingSystemContextKle$ = this.store.select(selectItSystemLoading);
  public readonly systemContextKles$ = this.store.select(selectItSystemKleUuids).pipe(
    filterNullish(),
    combineLatestWith(this.irrelevantKleUuidsSubject$),
    map(([uuids, irrelevantKleUuids]) => {
      const irrelevantUuidLookup: Dictionary<string> = {};
      irrelevantKleUuids?.forEach((uuid) => (irrelevantUuidLookup[uuid] = uuid));
      return uuids.map<SelectedKle>((uuid) => ({
        uuid: uuid,
        availableCommands: this.getCommand(uuid, irrelevantUuidLookup),
      }));
    })
  );
  public readonly anyInherited$ = this.systemContextKles$.pipe(matchNonEmptyArray());

  ngOnInit(): void {
    if (this.irrelevantKleUuids$) {
      this.subscriptions.add(
        this.irrelevantKleUuids$.subscribe((uuids) => this.irrelevantKleUuidsSubject$.next(uuids))
      );
    }
  }

  private getCommand(uuid: string, irrelevantUuidLookup: Dictionary<string>): SelectedKleCommand[] {
    switch (this.mode) {
      case 'add-remove':
        return ['delete-assignment'];
      case 'toggle-on-off':
        return irrelevantUuidLookup[uuid] ? ['toggle-assignment-relevance-on'] : ['toggle-assignment-relevance-off'];
      default:
        return [];
    }
  }
}
