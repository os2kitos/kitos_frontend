import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIKLEDetailsDTO } from 'src/app/api/v2';
import { KLEActions } from 'src/app/store/kle/actions';
import { selectHasValidCache, selectKLEs } from 'src/app/store/kle/selectors';
import { BaseComponent } from '../../base/base.component';
import { compareKle, matchKleChoice, matchMainGroup, matchSubGroup } from '../../helpers/kle.helpers';
import { Dictionary } from '../../models/primitives/dictionary.model';
import { filterNullish } from '../../pipes/filter-nullish';
import { invertBooleanValue } from '../../pipes/invert-boolean-value';

@Component({
  selector: 'app-select-kle-dialog',
  templateUrl: './select-kle-dialog.component.html',
  styleUrls: ['./select-kle-dialog.component.scss'],
})
export class SelectKleDialogComponent extends BaseComponent implements OnInit {
  public isLoading = false;
  public canConfirm = false; //TODO: Subject on selected uuid?

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
    map((subGroups) => subGroups.map((kle) => this.mapChoice(kle)))
  );

  //TODO: Also combine with group filters
  public availableKle$ = this.allKle$.pipe(
    map((kles) => kles.filter(matchKleChoice)),
    map((sortedKles) => sortedKles.map((kle) => this.mapChoice(kle)))
  );

  constructor(private readonly dialog: MatDialogRef<SelectKleDialogComponent>, private readonly store: Store) {
    super();
  }

  private mapChoice(kle: APIKLEDetailsDTO): {
    fullText: string;
    disabled: string | undefined;
    uuid: string;
    kleNumber: string;
    description: string;
    parentKle?: import('c:/work/saw/kitos_frontend/src/app/api/v2/index').APIIdentityNamePairResponseDTO | undefined;
  } {
    return {
      ...kle,
      fullText: `${kle.kleNumber} ${kle.description}`,
      disabled: this.disabledKleUuidLooup[kle.uuid],
    };
  }

  public cancel(): void {
    this.dialog.close();
  }

  public confirm(): void {
    this.dialog.close(null); //TODO: Add result
  }

  public kleSelected(selected: unknown) {
    console.log(selected);
  }

  ngOnInit(): void {
    //Lookup of disabled options
    (this.disabledKleUuids ?? []).forEach((uuid) => {
      this.disabledKleUuidLooup[uuid] = uuid;
    });

    //Load KLE options
    this.store.dispatch(KLEActions.getKles());

    this.subscriptions.add(
      this.store
        .select(selectHasValidCache)
        .pipe(invertBooleanValue())
        .subscribe((hasValidCache) => (this.isLoading = hasValidCache))
    );
  }
}
