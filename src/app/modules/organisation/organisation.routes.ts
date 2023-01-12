import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { OrganisationComponent } from './organisation.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: AppPath.root,
    component: OrganisationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganisationRouterModule {}
