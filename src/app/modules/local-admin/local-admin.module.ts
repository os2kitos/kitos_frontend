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

@NgModule({
  declarations: [ LocalAdminComponent,
    LocalAdminInformationComponent,
    LocalAdminOrganizationComponent,
    OrganizationsGridComponent,
    LocalAdminItSystemComponent, LocalAdminDprComponent,
    LocalAdminItContractComponent,
    LocalAdminImportComponent,
    LocalAdminImportOrganizationComponent,
    FkOrgWriteDialogComponent,
    LocalAdminItSystemUsageComponent, UiConfigTabSectionComponent],
  imports: [CommonModule, ComponentsModule, SharedModule, LocalAdminRouterModule],
})
export class LocalAdminModule {}
