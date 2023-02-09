import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { ITSystemDetailsComponent } from './it-system-details/it-system-details.component';
import { ITSystemsComponent } from './it-systems.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: ITSystemsComponent,
  },
  { path: AppPath.itSystemDetails, component: ITSystemDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ITSystemRouterModule {}
