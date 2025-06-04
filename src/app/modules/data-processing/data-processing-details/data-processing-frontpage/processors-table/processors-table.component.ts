import { Component } from '@angular/core';
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
import { CreateProcessorDialogComponent } from './create-processor-dialog/create-processor-dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { ContentSpaceBetweenComponent } from '../../../../../shared/components/content-space-between/content-space-between.component';
import { IconButtonComponent } from '../../../../../shared/components/buttons/icon-button/icon-button.component';
import { TrashcanIconComponent } from '../../../../../shared/components/icons/trashcan-icon.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-states/empty-state.component';
import { CollectionExtensionButtonComponent } from '../../../../../shared/components/collection-extension-button/collection-extension-button.component';

@Component({
  selector: 'app-processors-table',
  templateUrl: './processors-table.component.html',
  styleUrl: './processors-table.component.scss',
  imports: [
    StandardVerticalContentGridComponent,
    NgIf,
    NativeTableComponent,
    NgFor,
    ParagraphComponent,
    ContentSpaceBetweenComponent,
    IconButtonComponent,
    TrashcanIconComponent,
    EmptyStateComponent,
    CollectionExtensionButtonComponent,
    AsyncPipe,
  ],
})
export class ProcessorsTableComponent extends BaseComponent {
  public readonly processors$ = this.store.select(selectDataProcessingProcessors).pipe(filterNullish());
  public readonly anyProcessors$ = this.processors$.pipe(matchNonEmptyArray());

  public readonly hasModifyPermissions$ = this.store.select(selectDataProcessingHasModifyPermissions);

  constructor(
    private store: Store,
    private dialog: MatDialog,
  ) {
    super();
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
        }),
    );
  }
  onAddNewProcessor() {
    this.dialog.open(CreateProcessorDialogComponent);
  }
}
