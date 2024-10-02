import { Component, Input } from '@angular/core';
import { OrganizationUser } from 'src/app/shared/models/organization-user/organization-user.model';

@Component({
  selector: 'app-copy-roles-dialog',
  templateUrl: './copy-roles-dialog.component.html',
  styleUrl: './copy-roles-dialog.component.scss'
})
export class CopyRolesDialogComponent {
  @Input() user!: OrganizationUser;


  public onCopyRoles(): void {

  }
}
