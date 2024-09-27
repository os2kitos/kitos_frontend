import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html',
  styleUrl: './user-info-dialog.component.scss',
})
export class UserInfoDialogComponent {
  @Input() user$!: Observable<OrganizationUser>;
  @Input() hasModificationPermission$!: Observable<boolean | undefined>;

  constructor(private store: Store) {}

  public onDeleteUser(): void {}

  public onEditUser(): void {}

  public onSendAdvis(user: OrganizationUser): void {
    this.store.dispatch(OrganizationUserActions.sendNotification(user.Uuid));
  }
}
