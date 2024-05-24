import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatestWith, first } from 'rxjs';
import { APIDataProcessorRegistrationSubDataProcessorResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessingHasModifyPermissions,
  selectDataProcessingSubProcessors,
} from 'src/app/store/data-processing/selectors';
import { CreateSubProcessorDialogComponent } from './create-sub-processor-dialog/create-sub-processor-dialog.component';

@Component({
  selector: 'app-sub-processors-table',
  templateUrl: './sub-processors-table.component.html',
  styleUrl: './sub-processors-table.component.scss',
})
export class SubProcessorsTableComponent extends BaseComponent {
  public readonly subprocessors$ = this.store.select(selectDataProcessingSubProcessors).pipe(filterNullish());
  public readonly anySubProcessors$ = this.subprocessors$.pipe(matchNonEmptyArray());

  public readonly hasModifyPermissions$ = this.store.select(selectDataProcessingHasModifyPermissions);

  constructor(private store: Store, private dialog: MatDialog) {
    super();
  }

  onDeleteProcessor(uuid: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(combineLatestWith(this.store.select(selectDataProcessingSubProcessors).pipe(filterNullish(), first())))
        .subscribe(([result, subprocessors]) => {
          if (result === true) {
            this.store.dispatch(DataProcessingActions.deleteDataProcessingSubProcessor(uuid, subprocessors));
          }
        })
    );
  }
  onAddNewSubProcessor() {
    this.dialog.open(CreateSubProcessorDialogComponent);
  }

  onEdit(subprocessor: APIDataProcessorRegistrationSubDataProcessorResponseDTO) {
    const dialogRef = this.dialog.open(CreateSubProcessorDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.subprocessor = subprocessor;
  }
}
