import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { OrganizationBasicInfoComponent } from './organization-basic-info/organization-basic-info.component';
import { EditOrganizationDialogComponent } from './organization-structure/edit-organization-dialog/edit-organization-dialog.component';
import { OrganizationStructureComponent } from './organization-structure/organization-structure.component';
import { OrganizationUsersComponent } from './organization-users/organization-users.component';
import { OrganizationComponent } from './organization.component';
import { OrganizationRouterModule } from './organization.routes';

@NgModule({
  declarations: [
    OrganizationComponent,
    OrganizationStructureComponent,
    OrganizationUsersComponent,
    OrganizationBasicInfoComponent,
    EditOrganizationDialogComponent,
  ],
  imports: [OrganizationRouterModule, SharedModule, ComponentsModule],
})
export class OrganizationModule {}
