import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GlobalAdminDataProcessingComponent } from './global-admin-data-processing/global-admin-data-processing.component';
import { GlobalAdminGlobalAdminsComponent } from './global-admin-global-admins/global-admin-global-admins.component';
import { GlobalAdminHelpTextsComponent } from './global-admin-help-texts/global-admin-help-texts.component';
import { GlobalAdminItContractComponent } from './global-admin-it-contract/global-admin-it-contract.component';
import { GlobalAdminItSystemComponent } from './global-admin-it-system/global-admin-it-system.component';
import { GlobalAdminLocalAdminsComponent } from './global-admin-local-admins/global-admin-local-admins.component';
import { GlobalAdminOrganizationComponent } from './global-admin-organization/global-admin-organization.component';
import { CreateOrganizationDialogComponent } from './global-admin-organizations/create-organization-dialog/create-organization-dialog.component';
import { EditOrganizationDialogComponent } from './global-admin-organizations/edit-organization-dialog/edit-organization-dialog.component';
import { GlobalAdminOrganizationsGridComponent } from './global-admin-organizations/global-admin-organizations-grid/global-admin-organizations-grid.component';
import { GlobalAdminOrganizationsComponent } from './global-admin-organizations/global-admin-organizations.component';
import { GlobalAdminOtherKleComponent } from './global-admin-other/global-admin-other-kle/global-admin-other-kle.component';
import { GlobalAdminOtherComponent } from './global-admin-other/global-admin-other.component';
import { GlobalAdminComponent } from './global-admin.component';
import { GlobalAdminRouterModule } from './global-admin.routes';

@NgModule({
  declarations: [
    GlobalAdminComponent,
    GlobalAdminOrganizationComponent,
    GlobalAdminGlobalAdminsComponent,
    GlobalAdminLocalAdminsComponent,
    GlobalAdminOrganizationsComponent,
    GlobalAdminItSystemComponent,
    GlobalAdminItContractComponent,
    GlobalAdminDataProcessingComponent,
    GlobalAdminOtherComponent,
    GlobalAdminHelpTextsComponent,
    GlobalAdminOrganizationsGridComponent,
    CreateOrganizationDialogComponent,
    EditOrganizationDialogComponent,
    GlobalAdminOtherKleComponent,
  ],
  imports: [CommonModule, ComponentsModule, SharedModule, GlobalAdminRouterModule],
})
export class GlobalAdminModule {}
