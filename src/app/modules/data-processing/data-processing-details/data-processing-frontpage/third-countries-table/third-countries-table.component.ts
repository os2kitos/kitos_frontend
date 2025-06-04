import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
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
import { CountryCreateDialogComponent } from './country-create-dialog/country-create-dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { ContentSpaceBetweenComponent } from '../../../../../shared/components/content-space-between/content-space-between.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { IconButtonComponent } from '../../../../../shared/components/buttons/icon-button/icon-button.component';
import { TrashcanIconComponent } from '../../../../../shared/components/icons/trashcan-icon.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-states/empty-state.component';
import { CollectionExtensionButtonComponent } from '../../../../../shared/components/collection-extension-button/collection-extension-button.component';

@Component({
  selector: 'app-third-countries-table',
  templateUrl: './third-countries-table.component.html',
  styleUrl: './third-countries-table.component.scss',
  imports: [
    StandardVerticalContentGridComponent,
    NgIf,
    NativeTableComponent,
    NgFor,
    ContentSpaceBetweenComponent,
    ParagraphComponent,
    IconButtonComponent,
    TrashcanIconComponent,
    EmptyStateComponent,
    CollectionExtensionButtonComponent,
    AsyncPipe,
  ],
})
export class ThirdCountriesTableComponent extends BaseComponent {
  @Output() public readonly patchEvent = new EventEmitter<APIUpdateDataProcessingRegistrationRequestDTO>();

  public readonly thirdCountries$ = this.store.select(selectDataProcessingTransferToCountries).pipe(filterNullish());
  public readonly anyThirdCountries$ = this.thirdCountries$.pipe(matchNonEmptyArray());

  public readonly hasModifyPermissions$ = this.store.select(selectDataProcessingHasModifyPermissions);

  constructor(
    private store: Store,
    private dialog: MatDialog,
  ) {
    super();
  }

  public onDeleteCountry(uuid: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(
          combineLatestWith(this.store.select(selectDataProcessingTransferToCountries).pipe(filterNullish(), first())),
        )
        .subscribe(([result, countries]) => {
          if (result === true) {
            this.store.dispatch(DataProcessingActions.deleteDataProcessingThirdCountry(uuid, countries));
          }
        }),
    );
  }

  public onAddNewCountry() {
    this.dialog.open(CountryCreateDialogComponent);
  }
}
