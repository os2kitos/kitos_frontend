import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { APIKLEDetailsDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { compareKle } from 'src/app/shared/helpers/kle.helpers';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { KLEActions } from 'src/app/store/kle/actions';
import { selectHasValidCache, selectKLEEntities } from 'src/app/store/kle/selectors';

export type AvailableKleCommands = 'delete-assignment' | 'toggle-relevance';
export interface KleCommandEventArgs {
  command: AvailableKleCommands;
  kleUuid: string;
}

@Component({
  selector: 'app-kle-table[selectedKleUuids]',
  templateUrl: './kle-table.component.html',
  styleUrls: ['./kle-table.component.scss'],
})
export class KleTableComponent extends BaseComponent implements OnInit {
  @Input() public hasModifyPermission = false;
  @Input() public selectedKleUuids!: Observable<Array<string>>;
  @Input() public availableCommands: Array<AvailableKleCommands> = [];
  @Output() public kleCommandRequested = new EventEmitter<KleCommandEventArgs>();

  private readonly selectedKleUuidsSubject = new BehaviorSubject<Array<string> | undefined>(undefined);
  private readonly selectedKleUuidsFromSubject = this.selectedKleUuidsSubject.pipe(filterNullish());
  private readonly kleLookup$ = this.store.select(selectKLEEntities).pipe(filterNullish());
  public readonly loadingKle$ = this.store.select(selectHasValidCache).pipe(invertBooleanValue());

  public readonly selectedKleDetails$ = combineLatest([
    this.selectedKleUuidsFromSubject,
    this.kleLookup$,
    this.loadingKle$,
  ]).pipe(
    map(([selectedKleUuids, kles, loadingKle]) => {
      if (loadingKle) {
        return null;
      }
      return selectedKleUuids
        .map(
          (uuid) =>
            kles[uuid] ??
            <APIKLEDetailsDTO>{
              uuid: uuid,
              kleNumber: '0',
              description: $localize`ukendt - genindlæs KITOS for at få vist beskrivelsen`,
            }
        )
        .sort(compareKle);
    }),
    filterNullish()
  );

  constructor(private readonly store: Store) {
    super();
  }

  public commandExecutionRequested(args: KleCommandEventArgs) {
    this.kleCommandRequested.emit(args);
  }

  ngOnInit(): void {
    //Load KLE options
    this.store.dispatch(KLEActions.getKles());

    this.subscriptions.add(
      this.selectedKleUuids.subscribe((selectedKles) => this.selectedKleUuidsSubject.next(selectedKles))
    );
  }
}
