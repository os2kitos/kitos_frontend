import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
import { APIOversightDateDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessingHasModifyPermissions,
  selectDataProcessingOversightDates,
} from 'src/app/store/data-processing/selectors';
import { WriteOversightDateDialogComponent } from './write-oversight-date-dialog/write-oversight-date-dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { TableRowActionsComponent } from '../../../../../shared/components/table-row-actions/table-row-actions.component';
import { IconButtonComponent } from '../../../../../shared/components/buttons/icon-button/icon-button.component';
import { PencilIconComponent } from '../../../../../shared/components/icons/pencil-icon.compnent';
import { TrashcanIconComponent } from '../../../../../shared/components/icons/trashcan-icon.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-states/empty-state.component';
import { CollectionExtensionButtonComponent } from '../../../../../shared/components/collection-extension-button/collection-extension-button.component';
import { AppDatePipe } from '../../../../../shared/pipes/app-date.pipe';

@Component({
  selector: 'app-oversights-table',
  templateUrl: './oversights-table.component.html',
  styleUrl: './oversights-table.component.scss',
  imports: [
    StandardVerticalContentGridComponent,
    NgIf,
    NativeTableComponent,
    NgFor,
    ParagraphComponent,
    TableRowActionsComponent,
    IconButtonComponent,
    PencilIconComponent,
    TrashcanIconComponent,
    EmptyStateComponent,
    CollectionExtensionButtonComponent,
    AsyncPipe,
    AppDatePipe,
  ],
})
export class OversightsTableComponent extends BaseComponent {
  public readonly oversightDates$ = this.store.select(selectDataProcessingOversightDates).pipe(filterNullish());
  public readonly anyOversightDates$ = this.oversightDates$.pipe(matchNonEmptyArray());
  public readonly hasModifyPermissions$ = this.store.select(selectDataProcessingHasModifyPermissions);

  constructor(
    private store: Store,
    private dialog: MatDialog,
  ) {
    super();
  }

  public addOversightDate(): void {
    this.dialog.open(WriteOversightDateDialogComponent);
  }

  public editOversightDate(oversightDate: APIOversightDateDTO): void {
    const dialogRef = this.dialog.open(WriteOversightDateDialogComponent);
    const dialogInstance = dialogRef.componentInstance as WriteOversightDateDialogComponent;
    dialogInstance.oversightDate = oversightDate;
  }

  public deleteOversightDate(oversightDateUuid?: string): void {
    if (!oversightDateUuid) return console.error('oversightDateUuid is required');

    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(combineLatestWith(this.store.select(selectDataProcessingOversightDates).pipe(filterNullish(), first())))
        .subscribe(([result, oversightDates]) => {
          if (result === true) {
            this.store.dispatch(
              DataProcessingActions.removeDataProcessingOversightDate(oversightDateUuid, oversightDates),
            );
          }
        }),
    );
  }
}
