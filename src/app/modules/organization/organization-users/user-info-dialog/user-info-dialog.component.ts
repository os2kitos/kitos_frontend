import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ODataOrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html',
  styleUrl: './user-info-dialog.component.scss',
})
export class UserInfoDialogComponent extends BaseComponent implements OnInit {
  @Input() user$!: Observable<ODataOrganizationUser>;
  @Input() hasModificationPermission$!: Observable<boolean | undefined>;

  public $sendingNotification = new BehaviorSubject(false);

  constructor(
    private store: Store,
    private dialogOpenerService: DialogOpenerService,
    private dialogRef: MatDialogRef<UserInfoDialogComponent>,
    private actions$: Actions
  ) {
    super();
  }
  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUserActions.sendNotificationSuccess))
        .subscribe(() => this.$sendingNotification.next(false))
    );
  }

  public onDeleteUser(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.deleteUserSuccess)).subscribe(() => {
        this.dialogRef.close();
      })
    );

    this.dialogOpenerService.openDeleteUserDialog(this.user$, true);
  }

  public onEditUser(user: ODataOrganizationUser): void {
    this.dialogOpenerService.openEditUserDialog(user, true);
  }

  public onSendAdvis(user: ODataOrganizationUser): void {
    this.$sendingNotification.next(true);
    this.store.dispatch(OrganizationUserActions.sendNotification(user.Uuid));
  }

  public getFullName(user: ODataOrganizationUser): string {
    return `${user.FirstName} ${user.LastName}`;
  }
}
