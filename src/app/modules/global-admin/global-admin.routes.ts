import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { GlobalAdminComponent } from './global-admin.component';
import { GlobalAdminOrganizationComponent } from './global-admin-organization/global-admin-organization.component';
import { GlobalAdminOrganizationsComponent } from './global-admin-organizations/global-admin-organizations.component';
import { GlobalAdminGlobalAdminsComponent } from './global-admin-global-admins/global-admin-global-admins.component';
import { GlobalAdminLocalAdminsComponent } from './global-admin-local-admins/global-admin-local-admins.component';
import { GlobalAdminItSystemComponent } from './global-admin-it-system/global-admin-it-system.component';
import { GlobalAdminItContractComponent } from './global-admin-it-contract/global-admin-it-contract.component';
import { GlobalAdminDataProcessingComponent } from './global-admin-data-processing/global-admin-data-processing.component';
import { GlobalAdminOtherComponent } from './global-admin-other/global-admin-other.component';
import { GlobalAdminHelpTextsComponent } from './global-admin-help-texts/global-admin-help-texts.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: GlobalAdminComponent,
    children: [
      {
        path: AppPath.root,
        pathMatch: 'full',
        redirectTo: AppPath.organizations,
      },
      {
        path: AppPath.organizations,
        component: GlobalAdminOrganizationsComponent,
      },
      {
        path: AppPath.globalAdmins,
        component: GlobalAdminGlobalAdminsComponent,
      },
      {
        path: AppPath.localAdmins,
        component: GlobalAdminLocalAdminsComponent,
      },
      {
        path: AppPath.organization,
        component: GlobalAdminOrganizationComponent,
      },
      {
        path: AppPath.itSystems,
        component: GlobalAdminItSystemComponent,
      },
      {
        path: AppPath.itContracts,
        component: GlobalAdminItContractComponent,
      },
      {
        path: AppPath.dataProcessing,
        component: GlobalAdminDataProcessingComponent,
      },
      {
        path: AppPath.other,
        component: GlobalAdminOtherComponent,
      },
      {
        path: AppPath.helpTexts,
        component: GlobalAdminHelpTextsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalAdminRouterModule {}
