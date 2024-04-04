import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { selectItContractSystemAgreementElements } from 'src/app/store/it-contract/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { AgreementElementCreateDialogComponent } from './agreement-element-create-dialog/agreement-element-create-dialog.component';

@Component({
  selector: 'app-it-contract-systems',
  templateUrl: './it-contract-systems.component.html',
  styleUrl: './it-contract-systems.component.scss',
})
export class ItContractSystemsComponent extends BaseComponent implements OnInit {
  public readonly systemAgreementElements$ = this.store
    .select(selectItContractSystemAgreementElements)
    .pipe(filterNullish());
  public readonly anyAgreementElements$ = this.systemAgreementElements$.pipe(matchNonEmptyArray());

  constructor(private readonly store: Store, private readonly dialog: MatDialog) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-contract-agreement-element-types'));
  }

  public onAddNew(): void {
    this.dialog.open(AgreementElementCreateDialogComponent);
  }
}
