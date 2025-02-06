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

@Component({
  selector: 'app-oversights-table',
  templateUrl: './oversights-table.component.html',
  styleUrl: './oversights-table.component.scss',
})
export class OversightsTableComponent extends BaseComponent {
  public readonly oversightDates$ = this.store.select(selectDataProcessingOversightDates).pipe(filterNullish());
  public readonly anyOversightDates$ = this.oversightDates$.pipe(matchNonEmptyArray());
  public readonly hasModifyPermissions$ = this.store.select(selectDataProcessingHasModifyPermissions);

  constructor(private store: Store, private dialog: MatDialog) {
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
              DataProcessingActions.removeDataProcessingOversightDate(oversightDateUuid, oversightDates)
            );
          }
        })
    );
  }
}
