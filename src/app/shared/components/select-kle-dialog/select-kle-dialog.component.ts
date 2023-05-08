import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, combineLatestWith, first, map } from 'rxjs';
import { APIKLEDetailsDTO } from 'src/app/api/v2';
import { KLEActions } from 'src/app/store/kle/actions';
import { selectHasValidCache, selectKLEs } from 'src/app/store/kle/selectors';
import { BaseComponent } from '../../base/base.component';
import { KLE_DIALOG_DEFAULT_WIDTH } from '../../constants';
import { compareKle, matchKleChoice, matchMainGroup, matchSubGroup } from '../../helpers/kle.helpers';
import { Dictionary } from '../../models/primitives/dictionary.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { invertBooleanValue } from '../../pipes/invert-boolean-value';

interface KleChoiceViewModel extends APIKLEDetailsDTO {
  fullText: string;
  disabled: boolean;
}

@Component({
  selector: 'app-select-kle-dialog',
  templateUrl: './select-kle-dialog.component.html',
  styleUrls: ['./select-kle-dialog.component.scss'],
})
export class SelectKleDialogComponent extends BaseComponent implements OnInit {
  public readonly isLoading = new BehaviorSubject<boolean>(false);
  public readonly canConfirm = new BehaviorSubject<boolean>(false);

  public readonly selectedMainGroupFilter = new BehaviorSubject<KleChoiceViewModel | undefined>(undefined);
  public readonly selectedSubGroupFilter = new BehaviorSubject<KleChoiceViewModel | undefined>(undefined);
  public readonly selectedKle = new BehaviorSubject<KleChoiceViewModel | undefined>(undefined);

  @Input() public disabledKleUuids: Array<string> = [];
  private disabledKleUuidLooup: Dictionary<string> = {};

  private readonly allKle$ = this.store.select(selectKLEs).pipe(
    filterNullish(),
    map((kles) => kles.sort(compareKle))
  );

  public mainGroups$ = this.allKle$.pipe(
    map((kles) => kles.filter(matchMainGroup)),
    map((mainGroups) => mainGroups.map((kle) => this.mapChoice(kle)))
  );

  public subGroups$ = this.allKle$.pipe(
    map((kles) => kles.filter(matchSubGroup)),
    combineLatestWith(this.selectedMainGroupFilter),
    map(([subGroups, mainGroupFilter]) =>
      subGroups
        .filter((subGroup) => this.matchByKleNumberPrefix(mainGroupFilter, subGroup))
        .map((kle) => this.mapChoice(kle))
    )
  );

  public availableKle$ = this.allKle$.pipe(
    map((kles) => kles.filter(matchKleChoice)),
    combineLatestWith(this.selectedMainGroupFilter, this.selectedSubGroupFilter),
    map(([sortedKles, mainGroupFilter, subGroupFilter]) =>
      sortedKles
        .filter((kle) => this.matchByKleNumberPrefix(mainGroupFilter, kle))
        .filter((kle) => this.matchByKleNumberPrefix(subGroupFilter, kle))
        .map((kle) => this.mapChoice(kle))
    )
  );

  constructor(
    private readonly dialog: MatDialogRef<SelectKleDialogComponent, string | undefined>,
    private readonly store: Store
  ) {
    super();
    this.dialog.updateSize(`${KLE_DIALOG_DEFAULT_WIDTH}px`);
  }

  private matchByKleNumberPrefix(kleFilter: KleChoiceViewModel | undefined, subGroup: APIKLEDetailsDTO): boolean {
    return kleFilter === undefined || subGroup.kleNumber.startsWith(kleFilter.kleNumber);
  }

  private mapChoice(kle: APIKLEDetailsDTO): KleChoiceViewModel {
    return {
      ...kle,
      fullText: `${kle.kleNumber} ${kle.description}`,
      disabled: !!this.disabledKleUuidLooup[kle.uuid],
    };
  }

  public cancel(): void {
    this.dialog.close();
  }

  public confirm(): void {
    this.subscriptions.add(
      this.selectedKle.pipe(filterNullish(), first()).subscribe((selectedKle) => this.dialog.close(selectedKle.uuid))
    );
  }

  public mainGroupChanged(selected: KleChoiceViewModel | undefined | null) {
    this.selectedMainGroupFilter.next(selected === null ? undefined : selected);
  }

  public subGroupChanged(selected: KleChoiceViewModel | undefined | null) {
    this.selectedSubGroupFilter.next(selected === null ? undefined : selected);
  }

  public kleSelected(selected: KleChoiceViewModel | undefined | null) {
    this.selectedKle.next(selected === null ? undefined : selected);
  }

  ngOnInit(): void {
    //Lookup of disabled options
    (this.disabledKleUuids ?? []).forEach((uuid) => {
      this.disabledKleUuidLooup[uuid] = uuid;
    });

    this.subscriptions.add(
      this.store
        .select(selectHasValidCache)
        .pipe(invertBooleanValue())
        .subscribe((hasValidCache) => this.isLoading.next(hasValidCache))
    );

    //Allow confirm when a kle is chosen
    this.subscriptions.add(this.selectedKle.subscribe((selectedKle) => this.canConfirm.next(!!selectedKle)));

    //Auto reset incompatible values based on filter selection changes
    this.subscriptions.add(
      combineLatest([this.selectedMainGroupFilter, this.selectedSubGroupFilter, this.selectedKle]).subscribe(
        ([selectedMainGroup, selectedSubGroup, selectedKle]) => {
          //Reset selected kle if ancestry disallows it
          if (selectedKle != undefined) {
            if (
              [selectedMainGroup, selectedSubGroup].some(
                (filter) => this.matchByKleNumberPrefix(filter, selectedKle) === false
              )
            ) {
              this.selectedKle.next(undefined);
            }
          }
          //Reset selected kle sub group if ancestry disallows it
          if (selectedSubGroup != undefined) {
            if ([selectedMainGroup].some((filter) => this.matchByKleNumberPrefix(filter, selectedSubGroup) === false)) {
              this.selectedSubGroupFilter.next(undefined);
            }
          }
        }
      )
    );

    //Load KLE options
    this.store.dispatch(KLEActions.getKles());
  }
}
