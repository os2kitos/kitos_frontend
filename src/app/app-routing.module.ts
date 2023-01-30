import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from './shared/enums/app-path';
import { AuthGuardService } from './shared/guards/auth-guard.service';
import { StartupGuardService } from './shared/guards/startup-guard.service';

const routes: Routes = [
  {
    path: AppPath.root,
    canActivate: [StartupGuardService],
    children: [
      {
        path: AppPath.root,
        loadChildren: () => import('./modules/frontpage/frontpage.module').then((m) => m.FrontpageModule),
      },
      {
        path: AppPath.organisation,
        loadChildren: () => import('./modules/organisation/organisation.module').then((m) => m.OrganisationModule),
        canActivate: [AuthGuardService],
      },
      {
        path: AppPath.itSystems,
        loadChildren: () => import('./modules/it-systems/it-systems.module').then((m) => m.ItSystemsModule),
        canActivate: [AuthGuardService],
      },
      {
        path: AppPath.itContracts,
        loadChildren: () => import('./modules/it-contracts/it-contracts.module').then((m) => m.ITContractsModule),
        canActivate: [AuthGuardService],
      },
      {
        path: AppPath.dataProcessing,
        loadChildren: () =>
          import('./modules/data-processing/data-processing.module').then((m) => m.DataProcessingModule),
        canActivate: [AuthGuardService],
      },
      {
        path: AppPath.profile,
        loadChildren: () => import('./modules/profile/profile.module').then((m) => m.ProfileModule),
        canActivate: [AuthGuardService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
