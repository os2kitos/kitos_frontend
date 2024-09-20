import { Component, Input } from '@angular/core';
import { OrganizationUser } from 'src/app/shared/models/organization-user/organization-user.model';

@Component({
  selector: 'app-user-info-dialog',
  templateUrl: './user-info-dialog.component.html',
  styleUrl: './user-info-dialog.component.scss'
})
export class UserInfoDialogComponent {

  @Input() user!: OrganizationUser;


  public onDeleteUser(): void {

  }

  public onEditUser(): void {

  }

  public onSendAdvis(): void {

  }
}
