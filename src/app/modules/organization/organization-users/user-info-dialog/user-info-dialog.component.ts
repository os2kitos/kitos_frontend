import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrganizationUser } from 'src/app/shared/models/organization-user/organization-user.model';
import { OrganizationUserActions } from 'src/app/store/organization-user/actions';
import { CopyRolesDialogComponent } from '../copy-roles-dialog/copy-roles-dialog.component';

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html',
  styleUrl: './user-info-dialog.component.scss',
})
export class UserInfoDialogComponent {
  @Input() user$!: Observable<OrganizationUser>;
  @Input() hasModificationPermission$!: Observable<boolean | undefined>;

  constructor(private store: Store, private dialog: MatDialog) {}

  public onDeleteUser(): void {}

  public onEditUser(user: OrganizationUser): void {
    const dialogRef = this.dialog.open(CopyRolesDialogComponent) //TODO, temporary for development
    dialogRef.componentInstance.user = user;
  }

  public onSendAdvis(user: OrganizationUser): void {
    this.store.dispatch(OrganizationUserActions.sendNotification(user.Uuid));
  }
}
