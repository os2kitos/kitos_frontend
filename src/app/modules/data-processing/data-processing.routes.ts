import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { DataProcessingDetailsComponent } from './data-processing-details/data-processing-details.component';
import { DataProcessingFrontpageComponent } from './data-processing-details/data-processing-frontpage/data-processing-frontpage.component';
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
