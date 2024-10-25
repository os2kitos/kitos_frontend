import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocalAdminDprComponent } from './local-admin-dpr/local-admin-dpr.component';
import { FkOrgChangelogComponent } from './local-admin-import/local-admin-import-organization/fk-org-changelog/fk-org-changelog.component';
import { FkOrgDeleteDialogComponent } from './local-admin-import/local-admin-import-organization/fk-org-delete-dialog/fk-org-delete-dialog.component';
import { FkOrgWriteDialogComponent } from './local-admin-import/local-admin-import-organization/fk-org-write-dialog/fk-org-write-dialog.component';
import { LocalAdminImportFkOrgComponent } from './local-admin-import/local-admin-import-organization/local-admin-import-fk-org/local-admin-import-fk-org.component';
import { LocalAdminImportOrganizationComponent } from './local-admin-import/local-admin-import-organization/local-admin-import-organization.component';
import { LocalAdminImportComponent } from './local-admin-import/local-admin-import.component';
import { LocalAdminBaseExcelExportComponent } from './local-admin-import/local-admin-import/local-admin-base-excel-export/local-admin-base-excel-export.component';
import { LocalAdminInformationComponent } from './local-admin-information/local-admin-information.component';
import { LocalAdminItContractComponent } from './local-admin-it-contract/local-admin-it-contract.component';
import { LocalAdminItSystemComponent } from './local-admin-it-system/local-admin-it-system.component';
import { LocalAdminOrganizationComponent } from './local-admin-organization/local-admin-organization.component';
import { OrganizationsGridComponent } from './local-admin-organization/organizations-grid/organizations-grid.component';
import { LocalAdminComponent } from './local-admin.component';
import { LocalAdminRouterModule } from './local-admin.routes';

@NgModule({
  declarations: [
    LocalAdminComponent,
    LocalAdminInformationComponent,
    LocalAdminOrganizationComponent,
    OrganizationsGridComponent,
    LocalAdminItSystemComponent,
    LocalAdminDprComponent,
    LocalAdminItContractComponent,
    LocalAdminImportComponent,
    LocalAdminImportOrganizationComponent,
    FkOrgWriteDialogComponent,
    FkOrgDeleteDialogComponent,
    FkOrgChangelogComponent,
    LocalAdminImportFkOrgComponent,
    LocalAdminBaseExcelExportComponent,
  ],
  imports: [CommonModule, ComponentsModule, SharedModule, LocalAdminRouterModule],
})
export class LocalAdminModule {}
