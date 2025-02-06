import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { combineLatest, map, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { filterNullish } from '../../../../pipes/filter-nullish';
import { ClipboardService } from '../../../../services/clipboard.service';
import { NotificationService } from '../../../../services/notification.service';
import { GridUsagesDialogComponentStore } from '../grid-usages-dialog/grid-usages-dialog.component-store';

@Component({
  selector: 'app-grid-usages-consequences-dialog',
  templateUrl: './grid-usages-consequences-dialog.component.html',
  styleUrl: './grid-usages-consequences-dialog.component.scss',
  providers: [GridUsagesDialogComponentStore],
})
export class GridUsagesConsequencesDialogComponent extends BaseComponent implements OnInit {
  @Input() public title!: string;
  @Input() public targetItSystemUuid!: string;
  @Input() public usingOrganizationUuid!: string;
  @Input() sourceItSystemUuid!: string;

  public readonly migration$ = this.componentStore.migration$;
  public readonly loading$ = this.componentStore.loading$;

  public hasAcceptedConsequences: boolean = false;
  public readonly consequencesContentId = 'consequences-content';

  public isCopingToClipboard = false;

  constructor(
    private readonly dialogRef: MatDialogRef<GridUsagesConsequencesDialogComponent>,
    @Inject(GridUsagesDialogComponentStore) private readonly componentStore: GridUsagesDialogComponentStore,
    private readonly dialog: MatDialog,
    private readonly notificationService: NotificationService,
    private readonly cdr: ChangeDetectorRef,
    private readonly clipboardService: ClipboardService,
    private readonly actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.componentStore.getMigration({
      targetItSystemUuid: this.targetItSystemUuid,
      sourceItSystemUuid: this.sourceItSystemUuid,
      usingOrganizationUuid: this.usingOrganizationUuid,
    });

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemActions.executeUsageMigrationSuccess)).subscribe(() => {
        this.dialog.closeAll();
      })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemActions.executeUsageMigrationError)).subscribe(() => {
        this.componentStore.finishLoading();
      })
    );
  }

  public onCancel() {
    this.dialogRef.close();
  }

  public onConfirm() {
    this.componentStore.executeMigration(this.targetItSystemUuid);
  }

  public hasConsequences(): Observable<boolean> {
    return combineLatest([
      this.hasContractsConsequences(),
      this.hasDprConsequences(),
      this.hasRelationsConsequences(),
    ]).pipe(map((results) => results.some((result) => result === true)));
  }

  public hasContractsConsequences() {
    return this.migration$.pipe(
      filterNullish(),
      map((migration) => {
        return migration.affectedContracts && migration.affectedContracts.length > 0;
      })
    );
  }

  public hasDprConsequences() {
    return this.migration$.pipe(
      filterNullish(),
      map((migration) => {
        return (
          migration.affectedDataProcessingRegistrations && migration.affectedDataProcessingRegistrations.length > 0
        );
      })
    );
  }

  public hasRelationsConsequences() {
    return this.migration$.pipe(
      filterNullish(),
      map((migration) => {
        return migration.affectedRelations && migration.affectedRelations.length > 0;
      })
    );
  }

  public isConfirmDisabled() {
    return this.hasConsequences().pipe(
      map((hasConsequences) => {
        if (!hasConsequences) return false;
        return !this.hasAcceptedConsequences;
      })
    );
  }

  public copyConsequencesToClipboard() {
    this.isCopingToClipboard = true;
    this.cdr.detectChanges();
    this.clipboardService.copyContentToClipBoardById(this.consequencesContentId);
    this.notificationService.showDefault($localize`Konsekvenserne er kopieret til udklipsholderen`);
    this.isCopingToClipboard = false;
  }
}
