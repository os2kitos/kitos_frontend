import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatest, first, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { SelectKleDialogComponent } from 'src/app/shared/components/select-kle-dialog/select-kle-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageLocallyAddedKleUuids,
} from 'src/app/store/it-system-usage/selectors';
import { selectItSystemKleUuids } from 'src/app/store/it-system/selectors';
import { KleCommandEventArgs, SelectedKle } from '../../../shared/kle-table/kle-table.component';

@Component({
  selector: 'app-it-system-usage-details-kle',
  templateUrl: './it-system-usage-details-kle.component.html',
  styleUrls: ['./it-system-usage-details-kle.component.scss'],
})
export class ItSystemUsageDetailsKleComponent extends BaseComponent implements OnInit {
  private disabledKleUuids: Array<string> = [];
  public hasModifyPermission$ = this.store.select(selectITSystemUsageHasModifyPermission);
  private readonly localKleUuids$ = this.store.select(selectItSystemUsageLocallyAddedKleUuids).pipe(filterNullish());
  public readonly localKleUuidsWithActions$ = this.localKleUuids$.pipe(
    map((uuids) => uuids.map<SelectedKle>((uuid) => ({ uuid: uuid, availableCommands: ['delete-assignment'] })))
  );
  public readonly systemContextKleUuids$ = this.store.select(selectItSystemKleUuids).pipe(filterNullish());
  public readonly anyLocalKleUuids$ = this.store
    .select(selectItSystemUsageLocallyAddedKleUuids)
    .pipe(filterNullish(), matchNonEmptyArray());

  constructor(private readonly store: Store, private readonly dialog: MatDialog) {
    super();
  }

  public onAddNew() {
    const selectkleRef = this.dialog.open<SelectKleDialogComponent, string | undefined>(SelectKleDialogComponent);
    selectkleRef.componentInstance.disabledKleUuids = this.disabledKleUuids;
    this.subscriptions.add(
      selectkleRef
        .afterClosed()
        .pipe(first())
        .subscribe((addedKleUuid) => {
          if (addedKleUuid) {
            this.store.dispatch(ITSystemUsageActions.addLocalKle(addedKleUuid));
          }
        })
    );
  }

  public onRemoveLocalKleRequested(args: KleCommandEventArgs) {
    if (args.command === 'delete-assignment') {
      const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
      const confirmationDialogComponent = confirmationDialogRef.componentInstance as ConfirmationDialogComponent;
      confirmationDialogComponent.bodyText = $localize`Er du sikker på at du vil fjerne den lokale tilknytning?`;
      confirmationDialogComponent.confirmColor = 'warn';

      confirmationDialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.store.dispatch(ITSystemUsageActions.removeLocalKle(args.kleUuid));
        }
      });
    }
  }

  public onToggleInheritedKle(args: KleCommandEventArgs) {
    switch (args.command) {
      case 'toggle-assignment-relevance-off':
        console.log('off', args);
        break;
      case 'toggle-assignment-relevance-on':
        console.log('on', args);
        break;
      default:
        console.error('Invalid command on inherited kle', args);
        break;
    }
  }

  ngOnInit(): void {
    this.subscriptions.add(
      combineLatest([this.systemContextKleUuids$, this.localKleUuids$]).subscribe(
        ([systemKleUuids, localKleUuids]) => (this.disabledKleUuids = [...systemKleUuids, ...localKleUuids])
      )
    );
  }
}
