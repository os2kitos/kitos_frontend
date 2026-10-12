import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatestWith, first, map } from 'rxjs';
import { APIDataProcessorRegistrationSubDataProcessorResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { addOptionalExpiredText } from 'src/app/shared/helpers/option-type.helper';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import {
  selectDataProcessingHasModifyPermissions,
  selectDataProcessingSubProcessors,
} from 'src/app/store/data-processing/selectors';
import { BooleanCircleComponent } from '../../../../../shared/components/boolean-circle/boolean-circle.component';
import { IconButtonComponent } from '../../../../../shared/components/buttons/icon-button/icon-button.component';
import { CollectionExtensionButtonComponent } from '../../../../../shared/components/collection-extension-button/collection-extension-button.component';
import { ContentSpaceBetweenComponent } from '../../../../../shared/components/content-space-between/content-space-between.component';
import { EmptyStateComponent } from '../../../../../shared/components/empty-states/empty-state.component';
import { PencilIconComponent } from '../../../../../shared/components/icons/pencil-icon.compnent';
import { TrashcanIconComponent } from '../../../../../shared/components/icons/trashcan-icon.component';
import { NativeTableComponent } from '../../../../../shared/components/native-table/native-table.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TableRowActionsComponent } from '../../../../../shared/components/table-row-actions/table-row-actions.component';
import { CreateSubProcessorDialogComponent } from './create-sub-processor-dialog/create-sub-processor-dialog.component';

@Component({
  selector: 'app-sub-processors-table',
  templateUrl: './sub-processors-table.component.html',
  styleUrl: './sub-processors-table.component.scss',
  imports: [
    StandardVerticalContentGridComponent,
    NativeTableComponent,
    ParagraphComponent,
    BooleanCircleComponent,
    ContentSpaceBetweenComponent,
    TableRowActionsComponent,
    IconButtonComponent,
    PencilIconComponent,
    TrashcanIconComponent,
    EmptyStateComponent,
    CollectionExtensionButtonComponent,
    AsyncPipe,
  ],
})
export class SubProcessorsTableComponent extends BaseComponent {
  private readonly rawSubprocessors$ = this.store.select(selectDataProcessingSubProcessors).pipe(filterNullish());

  public readonly subprocessors$ = this.rawSubprocessors$.pipe(
    map((subprocessors) =>
      subprocessors.map((sp) => ({
        ...sp,
        dataProcessorOrganization: {
          ...sp.dataProcessorOrganization,
          name: addOptionalExpiredText(sp.dataProcessorOrganization.name, sp.dataProcessorOrganization.disabled),
        },
      })),
    ),
  );

  public readonly anySubProcessors$ = this.rawSubprocessors$.pipe(matchNonEmptyArray());
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
        .pipe(combineLatestWith(this.store.select(selectDataProcessingSubProcessors).pipe(filterNullish(), first())))
        .subscribe(([result, subprocessors]) => {
          if (result === true) {
            this.store.dispatch(DataProcessingActions.deleteDataProcessingSubProcessor(uuid, subprocessors));
          }
        }),
    );
  }

  onAddNewSubProcessor() {
    this.dialog.open(CreateSubProcessorDialogComponent);
  }

  onEdit(subprocessor: APIDataProcessorRegistrationSubDataProcessorResponseDTO) {
    this.rawSubprocessors$.pipe(first()).subscribe(() => {
      const dialogRef = this.dialog.open(CreateSubProcessorDialogComponent);
      const dialogInstance = dialogRef.componentInstance;
      dialogInstance.subprocessor = subprocessor;
    });
  }
}
