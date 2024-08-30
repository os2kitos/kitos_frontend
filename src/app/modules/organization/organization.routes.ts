import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { OrganizationBasicInfoComponent } from './organization-basic-info/organization-basic-info.component';
import { OrganizationStructureComponent } from './organization-structure/organization-structure.component';
import { OrganizationUsersComponent } from './organization-users/organization-users.component';
import { OrganizationComponent } from './organization.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: OrganizationComponent,
    children: [
      { path: AppPath.structure, component: OrganizationStructureComponent },
      { path: AppPath.structureDetails, component: OrganizationStructureComponent },
      { path: AppPath.users, component: OrganizationUsersComponent },
      { path: AppPath.basicInfo, component: OrganizationBasicInfoComponent },
      { path: AppPath.root, pathMatch: 'full', redirectTo: AppPath.structure },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRouterModule {}
