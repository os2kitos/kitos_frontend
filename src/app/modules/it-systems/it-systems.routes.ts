import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { ItSystemsComponent } from './it-systems.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: ItSystemsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ITSystemRouterModule {}
