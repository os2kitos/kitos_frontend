import { Component } from '@angular/core';
import { LocalAdminImportTabOptions } from '../local-admin-import.component';

@Component({
  selector: 'app-local-admin-import-organization',
  templateUrl: './local-admin-import-organization.component.html',
  styleUrl: './local-admin-import-organization.component.scss',
})
export class LocalAdminImportOrganizationComponent {
  public readonly organizationOptions = LocalAdminImportTabOptions.organization;
}
