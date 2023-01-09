import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from './shared/enums/app-path';
import { UserGuardService } from './shared/guards/user-guard.service';

const routes: Routes = [
  {
    path: AppPath.root,
    loadChildren: () => import('./modules/frontpage/frontpage.module').then((m) => m.FrontpageModule),
  },
  {
    path: AppPath.organisation,
    loadChildren: () => import('./modules/organisation/organisation.module').then((m) => m.OrganisationModule),
    canActivate: [UserGuardService],
  },
  {
    path: AppPath.itSystems,
    loadChildren: () => import('./modules/it-systems/it-systems.module').then((m) => m.ItSystemsModule),
    canActivate: [UserGuardService],
  },
  {
    path: AppPath.itContracts,
    loadChildren: () => import('./modules/it-contracts/it-contracts.module').then((m) => m.ITContractsModule),
    canActivate: [UserGuardService],
  },
  {
    path: AppPath.dataProcessing,
    loadChildren: () => import('./modules/data-processing/data-processing.module').then((m) => m.DataProcessingModule),
    canActivate: [UserGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
