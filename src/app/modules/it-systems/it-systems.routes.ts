import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { ITSystemUsageDetailsContractsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-contracts/it-system-usage-details-contracts.component';
import { ItSystemUsageDetailsDataProcessingComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-data-processing/it-system-usage-details-data-processing.component';
import { ITSystemUsageDetailsFrontpageComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-frontpage/it-system-usage-details-frontpage.component';
import { ITSystemUsageDetailsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details.component';
import { ITSystemUsagesComponent } from './it-system-usages/it-system-usages.component';
import { ITSystemsComponent } from './it-systems.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: ITSystemsComponent,
    children: [
      { path: AppPath.itSystemUsages, component: ITSystemUsagesComponent },
      {
        path: AppPath.itSystemUsagesDetails,
        component: ITSystemUsageDetailsComponent,
        children: [
          {
            path: AppPath.frontpage,
            component: ITSystemUsageDetailsFrontpageComponent,
          },
          {
            path: AppPath.contracts,
            component: ITSystemUsageDetailsContractsComponent,
          },
          {
            path: AppPath.dataProcessing,
            component: ItSystemUsageDetailsDataProcessingComponent,
          },
          { path: AppPath.root, pathMatch: 'full', redirectTo: AppPath.frontpage },
        ],
      },
      { path: AppPath.root, pathMatch: 'full', redirectTo: AppPath.itSystemUsages },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ITSystemsRouterModule { }
