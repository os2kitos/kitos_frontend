import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocalAdminInformationComponent } from './local-admin-information/local-admin-information.component';
import { LocalAdminItSystemUsagesComponent } from './local-admin-it-system-usages/local-admin-it-system-usages.component';
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
    LocalAdminItSystemUsagesComponent,
  ],
  imports: [CommonModule, ComponentsModule, SharedModule, LocalAdminRouterModule],
})
export class LocalAdminModule {}
