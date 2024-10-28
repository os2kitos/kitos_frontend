import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocalAdminInformationComponent } from './local-admin-information/local-admin-information.component';
import { LocalAdminItSystemUsageComponent } from './local-admin-it-system-usage/local-admin-it-system-usage.component';
import { LocalAdminOrganizationComponent } from './local-admin-organization/local-admin-organization.component';
import { OrganizationsGridComponent } from './local-admin-organization/organizations-grid/organizations-grid.component';
import { LocalAdminComponent } from './local-admin.component';
import { LocalAdminRouterModule } from './local-admin.routes';
import { UiConfigTabSectionComponent } from './ui-config-tab-section/ui-config-tab-section.component';
import { LocalAdminItContractComponent } from './local-admin-it-contract/local-admin-it-contract.component';
import { LocalAdminDprComponent } from './local-admin-dpr/local-admin-dpr.component';
import { FkOrgDeleteDialogComponent } from './local-admin-import/local-admin-import-organization/fk-org-delete-dialog/fk-org-delete-dialog.component';
import { FkOrgChangelogComponent } from './local-admin-import/local-admin-import-organization/fk-org-changelog/fk-org-changelog.component';
import { LocalAdminImportComponent } from './local-admin-import/local-admin-import.component';
import { LocalAdminImportOrganizationComponent } from './local-admin-import/local-admin-import-organization/local-admin-import-organization.component';
import { FkOrgWriteDialogComponent } from './local-admin-import/local-admin-import-organization/fk-org-write-dialog/fk-org-write-dialog.component';
import { UiConfigComponent } from './ui-config/ui-config.component';

@NgModule({
  declarations: [ LocalAdminComponent,
    LocalAdminInformationComponent,
    LocalAdminOrganizationComponent,
    OrganizationsGridComponent,
    LocalAdminItContractComponent,
    LocalAdminDprComponent,
    LocalAdminImportComponent,
    LocalAdminImportOrganizationComponent,
    FkOrgWriteDialogComponent,
    LocalAdminItSystemUsageComponent,
    UiConfigTabSectionComponent,
    FkOrgDeleteDialogComponent,
    FkOrgChangelogComponent,
    UiConfigComponent
  ],
  imports: [CommonModule, ComponentsModule, SharedModule, LocalAdminRouterModule],
})
export class LocalAdminModule {}
