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
import { DeleteOrganizationDialogComponent } from './global-admin-organizations/delete-organization-dialog/delete-organization-dialog.component';
import { RemovalConflictTableComponent } from './global-admin-organizations/delete-organization-dialog/removal-conflict-table/removal-conflict-table.component';
import { InnerConflictTableComponent } from './global-admin-organizations/delete-organization-dialog/removal-conflict-table/inner-conflict-table/inner-conflict-table.component';
import { GlobalAdminOtherKleComponent } from './global-admin-other/global-admin-other-kle/global-admin-other-kle.component';
import { GlobalAdminComponent } from './global-admin.component';
import { GlobalAdminOrganizationsComponent } from './global-admin-organizations/global-admin-organizations.component';
import { GlobalAdminOtherComponent } from './global-admin-other/global-admin-other.component';
import { GlobalAdminOrganizationsGridComponent } from './global-admin-organizations/global-admin-organizations-grid/global-admin-organizations-grid.component';
import { GlobalAdminRouterModule } from './global-admin.routes';
import { CreateGlobalAdminDialogComponent } from './global-admin-global-admins/create-global-admin-dialog/create-global-admin-dialog.component';
import { GlobalAdminsTableComponent } from './global-admin-global-admins/global-admins-table/global-admins-table.component';
import { CreateHelpTextDialogComponent } from './global-admin-help-texts/create-help-text-dialog/create-help-text-dialog.component';
import { GlobalAdminOtherUserShutdownComponent } from './global-admin-other/global-admin-other-user-shutdown/global-admin-other-user-shutdown.component';


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
    DeleteOrganizationDialogComponent,
    RemovalConflictTableComponent,
    InnerConflictTableComponent,
    GlobalAdminOtherKleComponent,
    GlobalAdminsTableComponent,
    CreateGlobalAdminDialogComponent,
    GlobalAdminOtherUserShutdownComponent,
    CreateHelpTextDialogComponent,
  ],
  imports: [CommonModule, ComponentsModule, SharedModule, GlobalAdminRouterModule],
})
export class GlobalAdminModule {}
