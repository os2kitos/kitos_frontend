import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-api-users-organizations-dialog',
  templateUrl: './api-users-organizations-dialog.component.html',
  styleUrl: './api-users-organizations-dialog.component.scss',
})
export class ApiUsersOrganizationsDialogComponent {
  @Input() public organizationNames: string[] = [];
}
