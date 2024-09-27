import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { OrganizationBasicInfoComponent } from './organization-basic-info/organization-basic-info.component';
import { EditOrganizationDialogComponent } from './organization-structure/edit-organization-dialog/edit-organization-dialog.component';
import { RegistrationsPageDetailsSectionComponent } from './organization-structure/edit-organization-dialog/registrations-page-details-section/registrations-page-details-section.component';
import { RegistrationsPaymentsSectionComponent } from './organization-structure/edit-organization-dialog/registrations-payments-section/registrations-payments-section.component';
import { RegistrationsRolesSectionComponent } from './organization-structure/edit-organization-dialog/registrations-roles-section/registrations-roles-section.component';
import { OrganizationStructureComponent } from './organization-structure/organization-structure.component';
import { OrganizationUnitRoleTableComponent } from './organization-structure/organization-unit-role-table/organization-unit-role-table.component';
import { CreateUserDialogComponent } from './organization-users/create-user-dialog/create-user-dialog.component';
import { OrganizationUsersComponent } from './organization-users/organization-users.component';
import { UserInfoDialogComponent } from './organization-users/user-info-dialog/user-info-dialog.component';
import { UserRoleTableComponent } from './organization-users/user-role-table/user-role-table.component';
import { OrganizationComponent } from './organization.component';
import { OrganizationRouterModule } from './organization.routes';

@NgModule({
  declarations: [
    OrganizationComponent,
    OrganizationStructureComponent,
    OrganizationUsersComponent,
    OrganizationBasicInfoComponent,
    EditOrganizationDialogComponent,
    RegistrationsRolesSectionComponent,
    RegistrationsPaymentsSectionComponent,
    RegistrationsPageDetailsSectionComponent,
    UserInfoDialogComponent,
    UserRoleTableComponent,
    OrganizationUnitRoleTableComponent,
    CreateUserDialogComponent,
  ],

  imports: [OrganizationRouterModule, SharedModule, ComponentsModule],
})
export class OrganizationModule {}
