import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { OrganizationUser } from 'src/app/shared/models/organization-user/organization-user.model';
import { OrganizationUserActions } from 'src/app/store/organization-user/actions';

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html',
  styleUrl: './user-info-dialog.component.scss',
})
export class UserInfoDialogComponent {
  @Input() user!: OrganizationUser;

  constructor(private store: Store) {}

  public onDeleteUser(): void {}

  public onEditUser(): void {}

  public onSendAdvis(): void {
    this.store.dispatch(OrganizationUserActions.sendNotification(this.user.Uuid));
  }
}
