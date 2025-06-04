import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { DeleteUserDialogComponent } from 'src/app/modules/organization/organization-users/delete-user-dialog/delete-user-dialog.component';
import { EditUserDialogComponent } from 'src/app/modules/organization/organization-users/edit-user-dialog/edit-user-dialog.component';
import { BulkActionDialogComponent } from '../components/dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { IconConfirmationDialogComponent } from '../components/dialogs/icon-confirmation-dialog/icon-confirmation-dialog.component';
import { GlobalOptionTypeDialogComponent } from '../components/global-option-type-view/global-option-type-dialog/global-option-type-dialog.component';
import { MAX_DIALOG_HEIGHT } from '../constants/constants';
import { GlobalAdminOptionType } from '../models/options/global-admin-option-type.model';
import { ODataOrganizationUser } from '../models/organization/organization-user/organization-user.model';

export const defaultDialogMaxSize = {
  height: 'auto',
  minWidth: '600px',
  maxWidth: '800px',
  maxHeight: '90vh%',
};

@Injectable({
  providedIn: 'root',
})
// This service is useful if you need to open the same or similar dialogs multiple places, which need setup/configuration.
export class DialogOpenerService {
  constructor(private dialog: MatDialog) {}

  public openEditUserDialog(user: ODataOrganizationUser, nested: boolean): MatDialogRef<EditUserDialogComponent> {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      height: '95%',
      maxHeight: MAX_DIALOG_HEIGHT,
    });
    dialogRef.componentInstance.user = user;
    dialogRef.componentInstance.isNested = nested;
    return dialogRef;
  }

  public openDeleteUserDialog(
    user$: Observable<ODataOrganizationUser>,
    nested: boolean,
  ): MatDialogRef<DeleteUserDialogComponent> {
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, defaultDialogMaxSize);
    dialogRef.componentInstance.user$ = user$;
    dialogRef.componentInstance.nested = nested;
    return dialogRef;
  }

  public openTakeSystemOutOfUseDialog(
    organizatioName: string | undefined = undefined,
  ): MatDialogRef<IconConfirmationDialogComponent> {
    const dialogRef = this.dialog.open(IconConfirmationDialogComponent);
    const confirmationDialogInstance = dialogRef.componentInstance as IconConfirmationDialogComponent;
    confirmationDialogInstance.confirmationType = 'Custom';
    confirmationDialogInstance.title = $localize`Er du sikker på, at du vil fjerne den lokale anvendelse af systemet?`;
    confirmationDialogInstance.bodyText = $localize`Dette sletter de lokale registreringer vedrørerende systemet i ${
      organizatioName ?? 'kommunen'
    }, men sletter ikke stamdata om systemet i IT System Kataloget.`;
    confirmationDialogInstance.icon = 'not-in-use';
    confirmationDialogInstance.confirmColor = 'warn';
    confirmationDialogInstance.customConfirmText = $localize`Bekræft`;
    confirmationDialogInstance.customDeclineText = $localize`Fortryd`;

    return dialogRef;
  }

  public openTakeSystemIntoUseDialog(): MatDialogRef<IconConfirmationDialogComponent> {
    const dialogRef = this.dialog.open(IconConfirmationDialogComponent);
    const confirmationDialogInstance = dialogRef.componentInstance as IconConfirmationDialogComponent;
    confirmationDialogInstance.confirmationType = 'Custom';
    confirmationDialogInstance.title = $localize`Tag system i anvendelse`;
    confirmationDialogInstance.bodyText = $localize`Hvis du ønsker at tage systemet i anvendelse, skal du bekræfte og udfylde information, som er relevant for din kommune nu eller senere under IT systemer.`;
    confirmationDialogInstance.icon = 'take-into-use';
    confirmationDialogInstance.confirmColor = 'primary';
    confirmationDialogInstance.customConfirmText = $localize`Bekræft og udfyld nu`;
    confirmationDialogInstance.customDeclineText = $localize`Bekræft og udfyld senere`;

    return dialogRef;
  }

  public openGlobalOptionTypeDialog(optionType: GlobalAdminOptionType): GlobalOptionTypeDialogComponent {
    const dialogRef = this.dialog.open(GlobalOptionTypeDialogComponent);
    const componentInstance = dialogRef.componentInstance;
    componentInstance.optionType = optionType;
    return componentInstance;
  }

  public openBulkActionDialog() {
    return this.dialog.open(BulkActionDialogComponent, { ...defaultDialogMaxSize, width: '50%' });
  }

  public openUserRoleSelectionDialog(user: ODataOrganizationUser) {
    const dialogRef = this.openBulkActionDialog();

    const instance = dialogRef.componentInstance;
    instance.dropdownDisabledUuids$ = of([user.Uuid]);
    instance.dropdownType = 'user';
    instance.emptyStateText = $localize`Brugeren har ingen roller`;
    instance.snackbarText = $localize`Vælg handling for valgte roller`;
    return dialogRef;
  }
}
