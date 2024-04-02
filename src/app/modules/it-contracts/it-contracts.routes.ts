import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from 'src/app/shared/enums/app-path';
import { ItContractDetailsComponent } from './it-contract-details/it-contract-details.component';
import { ItContractFrontpageComponent } from './it-contract-details/it-contract-frontpage/it-contract-frontpage.component';
import { ItContractsRootComponent } from './it-contracts-root.component';
import { ITContractsComponent } from './it-contracts.component';

const routes: Routes = [
  {
    path: AppPath.root,
    component: ItContractsRootComponent,
    children: [
      {
        path: AppPath.root,
        component: ITContractsComponent,
      },
      {
        path: AppPath.uuid,
        component: ItContractDetailsComponent,
        children: [
          { path: AppPath.frontpage, component: ItContractFrontpageComponent },
          { path: AppPath.root, pathMatch: 'full', redirectTo: AppPath.frontpage },
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
