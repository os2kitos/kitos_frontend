import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPath } from './shared/enums/app-path';
import { AuthGuardService } from './shared/guards/auth-guard.service';
import { StartupGuardService } from './shared/guards/startup-guard.service';
import { LocalAdminGuardService } from './shared/guards/local-admin-guard.service';
import { GlobalAdminGuardService } from './shared/guards/global-admin-guard.service';

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
        path: AppPath.organization,
        loadChildren: () => import('./modules/organization/organization.module').then((m) => m.OrganizationModule),
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
      {
        path: AppPath.localAdmin,
        loadChildren: () => import('./modules/local-admin/local-admin.module').then((m) => m.LocalAdminModule),
        canActivate: [LocalAdminGuardService],
      },
      {
        path: AppPath.globalAdmin,
        loadChildren: () => import('./modules/global-admin/global-admin.module').then((m) => m.GlobalAdminModule),
        canActivate: [GlobalAdminGuardService],
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
