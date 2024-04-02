import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { ItContractDetailsComponent } from './it-contract-details/it-contract-details.component';
import { ItContractFrontpageComponent } from './it-contract-details/it-contract-frontpage/it-contract-frontpage.component';
import { ITContractsComponent } from './it-contracts.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: ITContractsComponent,
    children: [
      {
        path: AppPath.root,
        component: ItContractDetailsComponent,
        children: [
          { path: AppPath.frontpage, component: ItContractFrontpageComponent },
          { path: AppPath.root, component: ItContractFrontpageComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ITContractsRouterModule {}
