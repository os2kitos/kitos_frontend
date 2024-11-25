import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DeleteUserDialogComponent } from 'src/app/modules/organization/organization-users/delete-user-dialog/delete-user-dialog.component';
import { EditUserDialogComponent } from 'src/app/modules/organization/organization-users/edit-user-dialog/edit-user-dialog.component';
import { ODataOrganizationUser } from '../models/organization/organization-user/organization-user.model';
import { GlobalOptionTypeDialogComponent } from '../components/global-option-type-view/global-option-type-dialog/global-option-type-dialog.component';
import { GlobalAdminOptionType } from '../models/options/global-admin-option-type.model';

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
      height: 'auto',
      maxHeight: '90vh%',
    });
    dialogRef.componentInstance.user$ = user$;
    dialogRef.componentInstance.nested = nested;
    return dialogRef;
  }

  public openGlobalOptionTypeDialog(optionType: GlobalAdminOptionType): GlobalOptionTypeDialogComponent {
    const dialogRef = this.dialog.open(GlobalOptionTypeDialogComponent);
    const componentInstance = dialogRef.componentInstance;
    componentInstance.optionType = optionType;
    return componentInstance;
  }
}
