import { Component, Input } from '@angular/core';
import { LocalAdminImportEntityType } from 'src/app/shared/enums/local-admin-import-entity-type';

@Component({
  selector: 'app-local-admin-import-organization',
  templateUrl: './local-admin-import-organization.component.html',
  styleUrl: './local-admin-import-organization.component.scss',
})
export class LocalAdminImportOrganizationComponent {
  @Input() public helpTextKey!: string;
  public readonly organizationOptions = LocalAdminImportEntityType.organization;
}
