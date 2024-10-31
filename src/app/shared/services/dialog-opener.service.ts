import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DeleteUserDialogComponent } from 'src/app/modules/organization/organization-users/delete-user-dialog/delete-user-dialog.component';
import { EditUserDialogComponent } from 'src/app/modules/organization/organization-users/edit-user-dialog/edit-user-dialog.component';
import { ODataOrganizationUser } from '../models/organization/organization-user/organization-user.model';

@Injectable({
  providedIn: 'root',
})

// This service is useful if you need to open the same or similar dialogs multiple places, which need setup/configuration.
export class DialogOpenerService {
  constructor(private dialog: MatDialog) {}

  public openEditUserDialog(user: ODataOrganizationUser, nested: boolean): MatDialogRef<EditUserDialogComponent> {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      height: '95%',
      maxHeight: '750px',
    });
    dialogRef.componentInstance.user = user;
    dialogRef.componentInstance.isNested = nested;
    return dialogRef;
  }

  public openDeleteUserDialog(
    user$: Observable<ODataOrganizationUser>,
    nested: boolean
  ): MatDialogRef<DeleteUserDialogComponent> {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      width: '50%',
      minWidth: '600px',
      height: 'auto',
      maxHeight: '90vh%',
    });
    dialogRef.componentInstance.user$ = user$;
    dialogRef.componentInstance.nested = nested;
    return dialogRef;
  }
}
