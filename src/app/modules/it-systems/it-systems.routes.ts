import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { ITSystemUsageDetailsComponent } from './it-system-usages/it-system-details/it-system-usage-details.component';
import { ITSystemUsagesComponent } from './it-system-usages/it-system-usages.component';

const routes: Routes = [
  { path: AppPath.itSystemUsages, component: ITSystemUsagesComponent },
  { path: AppPath.itSystemUsagesDetails, component: ITSystemUsageDetailsComponent },

  { path: AppPath.root, pathMatch: 'full', redirectTo: AppPath.itSystemUsages },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ITSystemsRouterModule {}
