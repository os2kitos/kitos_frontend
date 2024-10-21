import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { LocalAdminImportComponent } from './local-admin-import/local-admin-import.component';
import { LocalAdminInformationComponent } from './local-admin-information/local-admin-information.component';
import { LocalAdminItSystemComponent } from './local-admin-it-system/local-admin-it-system.component';
import { LocalAdminOrganizationComponent } from './local-admin-organization/local-admin-organization.component';
import { LocalAdminComponent } from './local-admin.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: LocalAdminComponent,
    children: [
      {
        path: AppPath.root,
        pathMatch: 'full',
        redirectTo: AppPath.information,
      },
      {
        path: AppPath.information,
        component: LocalAdminInformationComponent,
      },
      {
        path: AppPath.organization,
        component: LocalAdminOrganizationComponent,
      },
      {
        path: AppPath.itSystems,
        component: LocalAdminItSystemComponent,
      },
      { path: AppPath.import, component: LocalAdminImportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalAdminRouterModule {}
