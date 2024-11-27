import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { FrontpageComponent } from './frontpage.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: AppPath.root,
    component: FrontpageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FrontpageRouterModule {}
