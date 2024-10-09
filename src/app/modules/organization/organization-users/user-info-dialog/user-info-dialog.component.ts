import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { OrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener-service.service';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html',
  styleUrl: './user-info-dialog.component.scss',
})
export class UserInfoDialogComponent extends BaseComponent {
  @Input() user$!: Observable<OrganizationUser>;
  @Input() hasModificationPermission$!: Observable<boolean | undefined>;

  constructor(
    private store: Store,
    private dialogOpenerService: DialogOpenerService,
    private dialogRef: MatDialogRef<UserInfoDialogComponent>,
    private actions$: Actions
  ) {
    super();
  }

  public onDeleteUser(user: OrganizationUser): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.deleteUserSuccess)).subscribe(() => {
        this.dialogRef.close();
      })
    );

    this.dialogOpenerService.openDeleteUserDialog(user, true);
  }

  public onEditUser(user: OrganizationUser): void {
    this.dialogOpenerService.openEditUserDialog(user, true);
  }

  public onSendAdvis(user: OrganizationUser): void {
    this.store.dispatch(OrganizationUserActions.sendNotification(user.Uuid));
  }

  public getFullName(user: OrganizationUser): string {
    return `${user.FirstName} ${user.LastName}`;
  }
}
