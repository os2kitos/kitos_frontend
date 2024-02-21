import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { combineLatestWith, first, map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { SelectKleDialogComponent } from 'src/app/shared/components/select-kle-dialog/select-kle-dialog.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { matchNonEmptyArray } from 'src/app/shared/pipes/match-non-empty-array';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { selectITSystemHasModifyPermission, selectItSystemKleUuids } from 'src/app/store/it-system/selectors';
import { KleCommandEventArgs, SelectedKle } from '../../../shared/kle-table/kle-table.component';

@Component({
  selector: 'app-it-system-catalog-kle',
  templateUrl: './it-system-catalog-kle.component.html',
  styleUrl: './it-system-catalog-kle.component.scss',
})
export class ItSystemCatalogKleComponent extends BaseComponent implements OnInit {
  private disabledKleUuids: Array<string> = [];
  public readonly hasModifyPermission$ = this.store.select(selectITSystemHasModifyPermission);
  private readonly localKleUuids$ = this.store.select(selectItSystemKleUuids).pipe(filterNullish());
  public readonly localKleUuidsWithActions$ = this.localKleUuids$.pipe(
    map((uuids) => uuids.map<SelectedKle>((uuid) => ({ uuid: uuid, availableCommands: ['delete-assignment'] })))
  );
  public readonly anyLocalKleUuids$ = this.store
    .select(selectItSystemKleUuids)
    .pipe(filterNullish(), matchNonEmptyArray());

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly confirmActionService: ConfirmActionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.localKleUuids$.subscribe((systemKleUuids) => (this.disabledKleUuids = [...systemKleUuids]))
    );
  }

  public onAddNew() {
    const selectkleRef = this.dialog.open<SelectKleDialogComponent, string | undefined>(SelectKleDialogComponent);
    selectkleRef.componentInstance.disabledKleUuids = this.disabledKleUuids;
    this.subscriptions.add(
      selectkleRef
        .afterClosed()
        .pipe(first())
        .pipe(combineLatestWith(this.store.select(selectItSystemKleUuids).pipe(filterNullish())))
        .subscribe(([addedKleUuid, kles]) => {
          if (addedKleUuid) {
            const patchKles = [...kles];
            patchKles.push(addedKleUuid);
            this.store.dispatch(ITSystemActions.patchITSystem({ kleUuids: patchKles }));
          }
        })
    );
  }

  public onRemoveLocalKleRequested(args: KleCommandEventArgs) {
    if (args.command === 'delete-assignment') {
      this.confirmActionService.confirmAction({
        category: ConfirmActionCategory.Warning,
        onConfirm: () =>
          this.subscriptions.add(
            this.store
              .select(selectItSystemKleUuids)
              .pipe(first(), filterNullish())
              .subscribe((kles) => {
                const patchKles = kles.filter((kle) => kle !== args.kleUuid);
                this.store.dispatch(ITSystemActions.patchITSystem({ kleUuids: patchKles }));
              })
          ),
        message: $localize`Er du sikker på, at du vil fjerne den lokale tilknytning?`,
      });
    }
  }
}
