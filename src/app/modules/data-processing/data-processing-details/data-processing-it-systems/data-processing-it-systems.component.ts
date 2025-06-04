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
  selectDataProcessingSystems,
} from 'src/app/store/data-processing/selectors';
import { CreateDprSystemUsageComponent } from './create-dpr-system-usage/create-dpr-system-usage.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { NativeTableComponent } from '../../../../shared/components/native-table/native-table.component';
import { ContentSpaceBetweenComponent } from '../../../../shared/components/content-space-between/content-space-between.component';
import { DetailsPageLinkComponent } from '../../../../shared/components/details-page-link/details-page-link.component';
import { IconButtonComponent } from '../../../../shared/components/buttons/icon-button/icon-button.component';
import { TrashcanIconComponent } from '../../../../shared/components/icons/trashcan-icon.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-states/empty-state.component';
import { CollectionExtensionButtonComponent } from '../../../../shared/components/collection-extension-button/collection-extension-button.component';

@Component({
  selector: 'app-data-processing-it-systems',
  templateUrl: './data-processing-it-systems.component.html',
  styleUrl: './data-processing-it-systems.component.scss',
  imports: [
    CardComponent,
    CardHeaderComponent,
    StandardVerticalContentGridComponent,
    NgIf,
    NativeTableComponent,
    NgFor,
    ContentSpaceBetweenComponent,
    DetailsPageLinkComponent,
    IconButtonComponent,
    TrashcanIconComponent,
    EmptyStateComponent,
    CollectionExtensionButtonComponent,
    AsyncPipe,
  ],
})
export class DataProcessingItSystemsComponent extends BaseComponent {
  public readonly systemUsages$ = this.store.select(selectDataProcessingSystems).pipe(filterNullish());
  public readonly anySystemUsages$ = this.systemUsages$.pipe(matchNonEmptyArray());

  public readonly hasModifyPermissions$ = this.store.select(selectDataProcessingHasModifyPermissions);

  constructor(
    private store: Store,
    private dialog: MatDialog,
  ) {
    super();
  }

  public onDeleteSystem(uuid: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(combineLatestWith(this.store.select(selectDataProcessingSystems).pipe(filterNullish(), first())))
        .subscribe(([result, systemUsages]) => {
          if (result === true) {
            this.store.dispatch(
              DataProcessingActions.deleteDataProcessingSystemUsage(
                uuid,
                systemUsages.map((usage) => usage.uuid),
              ),
            );
          }
        }),
    );
  }

  public onAddNewSystem() {
    this.dialog.open(CreateDprSystemUsageComponent);
  }
}
