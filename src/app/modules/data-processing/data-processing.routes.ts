import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { DataProcessingDetailsComponent } from './data-processing-details/data-processing-details.component';
import { DataProcessingFrontpageComponent } from './data-processing-details/data-processing-frontpage/data-processing-frontpage.component';
import { DataProcessingItContractsComponent } from './data-processing-details/data-processing-it-contracts/data-processing-it-contracts.component';
import { DataProcessingItSystemsComponent } from './data-processing-details/data-processing-it-systems/data-processing-it-systems.component';
import { DataProcessingNotificationsComponent } from './data-processing-details/data-processing-notifications/data-processing-notifications.component';
import { DataProcessingRolesComponent } from './data-processing-details/data-processing-roles/data-processing-roles.component';
import { DataProcessingReferencesComponent } from './data-processing-details/data-processing-references/data-processing-references.component';
import { DataProcessingOverviewComponent } from './data-processing-overview/data-processing-overview.component';
import { DataProcessingComponent } from './data-processing.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: DataProcessingComponent,
    children: [
      {
        path: AppPath.root,
        component: DataProcessingOverviewComponent,
      },
      {
        path: AppPath.uuid,
        component: DataProcessingDetailsComponent,
        children: [
          { path: AppPath.frontpage, component: DataProcessingFrontpageComponent },
          { path: AppPath.roles, component: DataProcessingRolesComponent },
          { path: AppPath.notifications, component: DataProcessingNotificationsComponent },
          { path: AppPath.itSystems, component: DataProcessingItSystemsComponent },
          { path: AppPath.externalReferences, component: DataProcessingReferencesComponent },
          { path: AppPath.itContracts, component: DataProcessingItContractsComponent },
          { path: AppPath.root, pathMatch: 'full', redirectTo: AppPath.frontpage },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataProcessingRouterModule {}
