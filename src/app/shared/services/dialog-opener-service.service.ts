import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditUserDialogComponent } from 'src/app/modules/organization/organization-users/edit-user-dialog/edit-user-dialog.component';
import { OrganizationUser } from '../models/organization/organization-user/organization-user.model';
import { DeleteUserDialogComponent } from 'src/app/modules/organization/organization-users/delete-user-dialog/delete-user-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogOpenerService {
  constructor(private dialog: MatDialog) {}

  public openEditUserDialog(user: OrganizationUser, nested: boolean): MatDialogRef<EditUserDialogComponent> {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      height: '95%',
      maxHeight: '750px',
    });
    dialogRef.componentInstance.user = user;
    dialogRef.componentInstance.isNested = nested;
    return dialogRef;
  }

  public openDeleteUserDialog(user: OrganizationUser, nested: boolean): MatDialogRef<DeleteUserDialogComponent> {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent);
    dialogRef.componentInstance.user = user;
    dialogRef.componentInstance.nested = nested;
    return dialogRef;
  }
}
