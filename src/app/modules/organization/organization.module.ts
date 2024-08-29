import { NgModule } from '@angular/core';
import { OrganizationBasicInfoComponent } from './organization-basic-info/organization-basic-info.component';
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
  ],
  imports: [OrganizationRouterModule],
})
export class OrganizationModule {}
