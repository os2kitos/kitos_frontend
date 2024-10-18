import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
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
export class LocalAdminImportOrganizationComponent implements OnInit {
  public readonly synchronizationStatus$ = this.store.select(selectSynchronizationStatus);
  public readonly isLoadingConnectionStatus$ = this.store.select(selectIsLoadingConnectionStatus);
  public readonly accessGranted$ = this.store.select(selectAccessGranted);
  public readonly accessError$ = this.store.select(selectAccessError);
  public readonly isConnected$ = this.store.select(selectIsConnected);

  constructor(private store: Store, private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(FkOrgActions.getSynchronizationStatus());
  }

  public openImportDialog() {
    this.matDialog.open(FkOrgWriteDialogComponent, {
      height: 'auto',
      maxHeight: '95%',
      width: 'auto',
      minWidth: '600px',
    });
  }
}
