import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { DataProcessingComponent } from './data-processing.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: DataProcessingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataProcessingRouterModule {}
