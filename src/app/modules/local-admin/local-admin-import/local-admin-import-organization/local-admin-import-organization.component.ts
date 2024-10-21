import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { FkOrgActions } from 'src/app/store/local-admin/fk-org/actions';
import {
  selectAccessError,
  selectAccessGranted,
  selectIsConnected,
  selectIsLoadingConnectionStatus,
  selectSynchronizationStatus,
} from 'src/app/store/local-admin/fk-org/selectors';
import { FkOrgWriteDialogComponent } from './fk-org-write-dialog/fk-org-write-dialog.component';

@Component({
  selector: 'app-local-admin-import-organization',
  templateUrl: './local-admin-import-organization.component.html',
  styleUrl: './local-admin-import-organization.component.scss',
})
export class LocalAdminImportOrganizationComponent extends BaseComponent implements OnInit {
  public readonly synchronizationStatus$ = this.store.select(selectSynchronizationStatus);
  public readonly isLoadingConnectionStatus$ = this.store.select(selectIsLoadingConnectionStatus);
  public readonly accessGranted$ = this.store.select(selectAccessGranted);
  public readonly accessError$ = this.store.select(selectAccessError);
  public readonly isConnected$ = this.store.select(selectIsConnected);

  constructor(private store: Store, private actions$: Actions, private matDialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.dispatchGetSynchronizationStatus();

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(FkOrgActions.createConnectionSuccess))
        .subscribe(() => this.dispatchGetSynchronizationStatus())
    );
  }

  public openImportDialog() {
    this.matDialog.open(FkOrgWriteDialogComponent, {
      height: 'auto',
      maxHeight: '95%',
      width: 'auto',
      minWidth: '900px',
    });
  }

  private dispatchGetSynchronizationStatus() {
    this.store.dispatch(FkOrgActions.getSynchronizationStatus());
  }
}
