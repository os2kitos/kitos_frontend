import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { FkOrgActions } from 'src/app/store/local-admin/fk-org/actions';
import {
  selectAccessError,
  selectAccessGranted,
  selectCanCreateConnection,
  selectCanDeleteConnection,
  selectCanModifyConnection,
  selectIsConnected,
  selectIsLoadingConnectionStatus,
  selectSynchronizationStatus,
} from 'src/app/store/local-admin/fk-org/selectors';
import { FkOrgDeleteDialogComponent } from '../fk-org-delete-dialog/fk-org-delete-dialog.component';
import { FkOrgWriteDialogComponent } from '../fk-org-write-dialog/fk-org-write-dialog.component';

@Component({
  selector: 'app-local-admin-import-fk-org',
  templateUrl: './local-admin-import-fk-org.component.html',
  styleUrl: './local-admin-import-fk-org.component.scss',
})
export class LocalAdminImportFkOrgComponent extends BaseComponent implements OnInit {
  public readonly synchronizationStatus$ = this.store.select(selectSynchronizationStatus);
  public readonly isLoadingConnectionStatus$ = this.store.select(selectIsLoadingConnectionStatus);
  public readonly accessGranted$ = this.store.select(selectAccessGranted);
  public readonly accessError$ = this.store.select(selectAccessError);
  public readonly isConnected$ = this.store.select(selectIsConnected);
  public readonly hasAutoUpdates$ = this.synchronizationStatus$.pipe(map((status) => status?.subscribesToUpdates));

  public readonly canCreateConnection$ = this.store.select(selectCanCreateConnection);
  public readonly canModifyConnection$ = this.store.select(selectCanModifyConnection);
  public readonly canDeleteConnection$ = this.store.select(selectCanDeleteConnection);

  constructor(
    private store: Store,
    private actions$: Actions,
    private matDialog: MatDialog,
    private confirmActionService: ConfirmActionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.dispatchGetSynchronizationStatus();

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            FkOrgActions.createConnectionSuccess,
            FkOrgActions.updateConnectionSuccess,
            FkOrgActions.deleteAutomaticUpdateSubscriptionSuccess,
            FkOrgActions.deleteConnectionSuccess
          )
        )
        .subscribe(() => this.dispatchGetSynchronizationStatus())
    );
  }

  public openImportDialog(isEdit: boolean) {
    const dialogRef = this.matDialog.open(FkOrgWriteDialogComponent, {
      height: 'auto',
      maxHeight: '95%',
      width: 'auto',
      maxWidth: '1200px',
    });

    const instance = dialogRef.componentInstance;
    instance.isEdit = isEdit;
  }

  public deleteAutoUpdate() {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      onConfirm: () => this.store.dispatch(FkOrgActions.deleteAutomaticUpdateSubscription()),
      title: $localize`Afbryd automatisk opdateringer`,
      message: $localize`Afbryd automatisk tjek for ventende opdateringer fra FK Organistion?`,
    });
  }

  public openDeleteConnectionDialog() {
    this.matDialog.open(FkOrgDeleteDialogComponent, { width: '800px' });
  }

  private dispatchGetSynchronizationStatus() {
    this.store.dispatch(FkOrgActions.getSynchronizationStatus());
  }
}
