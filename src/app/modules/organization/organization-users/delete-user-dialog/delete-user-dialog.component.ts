import { Component, Input } from '@angular/core';
import { OrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrl: './delete-user-dialog.component.scss'
})
export class DeleteUserDialogComponent {

  @Input() user!: OrganizationUser;
  @Input() nested: boolean = false;

}
