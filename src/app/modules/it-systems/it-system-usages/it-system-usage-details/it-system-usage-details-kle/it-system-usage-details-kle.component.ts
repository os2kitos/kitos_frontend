import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatest, first, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { SelectKleDialogComponent } from 'src/app/shared/components/select-kle-dialog/select-kle-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageLocallyAddedKleUuids,
  selectItSystemUsageLocallyRemovedKleUuids,
} from 'src/app/store/it-system-usage/selectors';
import { selectItSystemKleUuids } from 'src/app/store/it-system/selectors';
import { KleCommandEventArgs, SelectedKle } from '../../../shared/kle-table/kle-table.component';
import {
  selectITSystemUsageEnableInheritedKle,
  selectITSystemUsageEnableLocalKle,
} from 'src/app/store/organization/ui-module-customization/selectors';

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

  public inheritedKleMarkedAsIrrelevantUuids$ = this.store
    .select(selectItSystemUsageLocallyRemovedKleUuids)
    .pipe(filterNullish());

  public readonly inheritedKleEnabled$ = this.store.select(selectITSystemUsageEnableInheritedKle);
  public readonly localKleEnabled$ = this.store.select(selectITSystemUsageEnableLocalKle);

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly confirmActionService: ConfirmActionService
  ) {
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
            this.store.dispatch(ITSystemUsageActions.addLocalKLE(addedKleUuid));
          }
        })
    );
  }

  public onRemoveLocalKleRequested(args: KleCommandEventArgs) {
    if (args.command === 'delete-assignment') {
      this.confirmActionService.confirmAction({
        category: ConfirmActionCategory.Warning,
        onConfirm: () => this.store.dispatch(ITSystemUsageActions.removeLocalKLE(args.kleUuid)),
        message: $localize`Er du sikker på, at du vil fjerne den lokale tilknytning?`,
      });
    }
  }

  public onToggleInheritedKle(args: KleCommandEventArgs) {
    switch (args.command) {
      case 'toggle-assignment-relevance-off':
        this.confirmActionService.confirmAction({
          category: ConfirmActionCategory.Warning,
          onConfirm: () => this.store.dispatch(ITSystemUsageActions.removeInheritedKLE(args.kleUuid)),
          message: $localize`Er du sikker på, at du vil fjerne den nedarvede opgave?`,
        });
        break;
      case 'toggle-assignment-relevance-on':
        this.confirmActionService.confirmAction({
          category: ConfirmActionCategory.Neutral,
          onConfirm: () => this.store.dispatch(ITSystemUsageActions.restoreInheritedKLE(args.kleUuid)),
          message: $localize`Er du sikker på, at du vil gendanne den nedarvede opgave?`,
        });
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
