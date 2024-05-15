import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataProcessingRouterModule {}
