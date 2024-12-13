import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { NotificationDetailsItSystemUsagesComponent } from './notification-details/notification-details-it-system-usages/notification-details-it-system-usages.component';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { NotificationDetailsDataProcessingComponent } from './notification-details/notification-details-data-processing/notification-details-data-processing.component';
import { NotificationDetailsItContractsComponent } from './notification-details/notification-details-it-contracts/notification-details-it-contracts.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: NotificationDetailsComponent,
    children: [
      { path: AppPath.root, pathMatch: 'full', redirectTo: AppPath.itSystems },
      {
        path: AppPath.itSystems,
        component: NotificationDetailsItSystemUsagesComponent,
      },
      {
        path: AppPath.itContracts,
        component: NotificationDetailsItContractsComponent,
      },
      {
        path: AppPath.dataProcessing,
        component: NotificationDetailsDataProcessingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotifcationsRouterModule {}
