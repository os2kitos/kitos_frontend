import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { APIUpdateDataProcessingRegistrationRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessingHasModifyPermissions,
  selectDataProcessingTransferToCountries,
} from 'src/app/store/data-processing/selectors';

@Component({
  selector: 'app-third-countries-table',
  templateUrl: './third-countries-table.component.html',
  styleUrl: './third-countries-table.component.scss',
})
export class ThirdCountriesTableComponent extends BaseComponent {
  @Output() public readonly patchEvent = new EventEmitter<APIUpdateDataProcessingRegistrationRequestDTO>();

  public readonly thirdCountries$ = this.store.select(selectDataProcessingTransferToCountries).pipe(filterNullish());
  public readonly anyThirdCountries$ = this.thirdCountries$.pipe(matchNonEmptyArray());

  public readonly hasModifyPermissions$ = this.store.select(selectDataProcessingHasModifyPermissions);

  constructor(private store: Store, private dialog: MatDialog) {
    super();
  }

  public onDeleteCountry(uuid: string) {
    if (uuid === undefined) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          if (result === true) {
            this.store.dispatch(DataProcessingActions.deleteDataProcessingThirdCountry(uuid));
          }
        })
    );
  }

  public onAddNewCountry() {}
}
