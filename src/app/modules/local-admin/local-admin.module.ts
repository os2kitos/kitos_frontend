import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LocalAdminImportComponent } from './local-admin-import/local-admin-import.component';
import { LocalAdminInformationComponent } from './local-admin-information/local-admin-information.component';
import { LocalAdminComponent } from './local-admin.component';
import { LocalAdminRouterModule } from './local-admin.routes';
import { LocalAdminImportOrganizationComponent } from './local-admin-import/local-admin-import-organization/local-admin-import-organization.component';

@NgModule({
  declarations: [LocalAdminComponent, LocalAdminInformationComponent, LocalAdminImportComponent, LocalAdminImportOrganizationComponent],
  imports: [CommonModule, ComponentsModule, SharedModule, LocalAdminRouterModule],
})
export class LocalAdminModule {}
