import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { LocalAdminComponent } from './local-admin.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: LocalAdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalAdminRouterModule {}
