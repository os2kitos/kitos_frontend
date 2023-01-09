import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { ITContractsComponent } from './it-contracts.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: ITContractsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ITContractsRouterModule {}
