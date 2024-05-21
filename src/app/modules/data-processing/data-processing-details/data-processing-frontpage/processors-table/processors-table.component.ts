import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessingHasModifyPermissions,
  selectDataProcessingProcessors,
} from 'src/app/store/data-processing/selectors';

@Component({
  selector: 'app-processors-table',
  templateUrl: './processors-table.component.html',
  styleUrl: './processors-table.component.scss',
})
export class ProcessorsTableComponent extends BaseComponent implements OnInit {
  public readonly processors$ = this.store.select(selectDataProcessingProcessors).pipe(filterNullish());
  public readonly anyProcessors$ = this.processors$.pipe(matchNonEmptyArray());

  public readonly hasModifyPermissions$ = this.store.select(selectDataProcessingHasModifyPermissions);

  constructor(private store: Store, private dialog: MatDialog) {
    super();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onDeleteProcessor(uuid: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(combineLatestWith(this.store.select(selectDataProcessingProcessors).pipe(filterNullish(), first())))
        .subscribe(([result, processors]) => {
          if (result === true) {
            this.store.dispatch(DataProcessingActions.deleteDataProcessingProcessor(uuid, processors));
          }
        })
    );
  }
  onAddNewProcessor() {}
}
