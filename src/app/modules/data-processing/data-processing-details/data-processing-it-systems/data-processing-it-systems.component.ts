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

@Component({
  selector: 'app-data-processing-it-systems',
  templateUrl: './data-processing-it-systems.component.html',
  styleUrl: './data-processing-it-systems.component.scss',
})
export class DataProcessingItSystemsComponent extends BaseComponent {
  public readonly systemUsages$ = this.store.select(selectDataProcessingSystems).pipe(filterNullish());
  public readonly anySystemUsages$ = this.systemUsages$.pipe(matchNonEmptyArray());

  public readonly hasModifyPermissions$ = this.store.select(selectDataProcessingHasModifyPermissions);

  constructor(private store: Store, private dialog: MatDialog) {
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
                systemUsages.map((usage) => usage.uuid)
              )
            );
          }
        })
    );
  }

  public onAddNewSystem() {
    this.dialog.open(CreateDprSystemUsageComponent);
  }
}
