import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FkOrgWriteDialogComponent } from './local-admin-import/local-admin-import-organization/fk-org-write-dialog/fk-org-write-dialog.component';
import { LocalAdminImportOrganizationComponent } from './local-admin-import/local-admin-import-organization/local-admin-import-organization.component';
import { LocalAdminImportComponent } from './local-admin-import/local-admin-import.component';
import { LocalAdminInformationComponent } from './local-admin-information/local-admin-information.component';
import { LocalAdminItSystemComponent } from './local-admin-it-system/local-admin-it-system.component';
import { LocalAdminOrganizationComponent } from './local-admin-organization/local-admin-organization.component';
import { OrganizationsGridComponent } from './local-admin-organization/organizations-grid/organizations-grid.component';
import { LocalAdminItContractComponent } from './local-admin-it-contract/local-admin-it-contract.component';
import { LocalAdminComponent } from './local-admin.component';
import { LocalAdminRouterModule } from './local-admin.routes';
import { LocalAdminDprComponent } from './local-admin-dpr/local-admin-dpr.component';
import { FkOrgDeleteDialogComponent } from './local-admin-import/local-admin-import-organization/fk-org-delete-dialog/fk-org-delete-dialog.component';

@NgModule({
  declarations: [
    LocalAdminComponent,
    LocalAdminInformationComponent,
    LocalAdminOrganizationComponent,
    OrganizationsGridComponent,
    LocalAdminItSystemComponent, LocalAdminDprComponent,
    LocalAdminItContractComponent,
    LocalAdminImportComponent,
    LocalAdminImportOrganizationComponent,
    FkOrgWriteDialogComponent,
    FkOrgDeleteDialogComponent,
  ],
  imports: [CommonModule, ComponentsModule, SharedModule, LocalAdminRouterModule],
})
export class LocalAdminModule {}
