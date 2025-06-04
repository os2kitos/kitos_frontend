import { Component, Input } from '@angular/core';
import { LocalAdminImportEntityType } from 'src/app/shared/enums/local-admin-import-entity-type';
import { LocalAdminBaseExcelImportComponent } from '../local-admin-import/local-admin-base-excel-import/local-admin-base-excel-import.component';
import { LocalAdminImportFkOrgComponent } from './local-admin-import-fk-org/local-admin-import-fk-org.component';

@Component({
  selector: 'app-local-admin-import-organization',
  templateUrl: './local-admin-import-organization.component.html',
  styleUrl: './local-admin-import-organization.component.scss',
  imports: [LocalAdminBaseExcelImportComponent, LocalAdminImportFkOrgComponent],
})
export class LocalAdminImportOrganizationComponent {
  @Input() public helpTextKey!: string;
  public readonly organizationOptions = LocalAdminImportEntityType.organization;
}
