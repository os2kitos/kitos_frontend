import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResetPasswordComponent } from './modules/frontpage/reset-password/reset-password.component';
import { SendPasswordResetRequestComponent } from './modules/frontpage/send-password-reset-request/send-password-reset-request.component';
import { AppPath } from './shared/enums/app-path';
import { AuthGuardService } from './shared/guards/auth-guard.service';
import { GlobalAdminGuardService } from './shared/guards/global-admin-guard.service';
import { LocalAdminGuardService } from './shared/guards/local-admin-guard.service';
import { StartupGuardService } from './shared/guards/startup-guard.service';

const routes: Routes = [
  {
    path: AppPath.passwordReset,
    component: SendPasswordResetRequestComponent,
  },
  {
    path: `${AppPath.passwordReset}/:id`,
    component: ResetPasswordComponent,
  },
  {
    path: AppPath.root,
    canActivate: [StartupGuardService],
    children: [
      {
        path: AppPath.root,
        loadChildren: () => import('./modules/frontpage/frontpage.routes').then((m) => m.FrontpageRouterModule),
      },
      {
        path: AppPath.organization,
        loadChildren: () =>
          import('./modules/organization/organization.routes').then((m) => m.OrganizationRouterModule),
        canActivate: [AuthGuardService],
      },
      {
        path: AppPath.itSystems,
        loadChildren: () => import('./modules/it-systems/it-systems.routes').then((m) => m.ITSystemsRouterModule),
        canActivate: [AuthGuardService],
      },
      {
        path: AppPath.itContracts,
        loadChildren: () => import('./modules/it-contracts/it-contracts.routes').then((m) => m.ITContractsRouterModule),
        canActivate: [AuthGuardService],
      },
      {
        path: AppPath.dataProcessing,
        loadChildren: () =>
          import('./modules/data-processing/data-processing.routes').then((m) => m.DataProcessingRouterModule),
        canActivate: [AuthGuardService],
      },
      {
        path: AppPath.profile,
        loadChildren: () => import('./modules/profile/profile.routes').then((m) => m.ProfileRouterModule),
        canActivate: [AuthGuardService],
      },
      {
        path: AppPath.notifications,
        loadChildren: () =>
          import('./modules/notifications/notifications.routes').then((m) => m.NotifcationsRouterModule),
        canActivate: [AuthGuardService],
      },
      {
        path: AppPath.localAdmin,
        loadChildren: () => import('./modules/local-admin/local-admin.routes').then((m) => m.LocalAdminRouterModule),
        canActivate: [LocalAdminGuardService],
      },
      {
        path: AppPath.globalAdmin,
        loadChildren: () => import('./modules/global-admin/global-admin.routes').then((m) => m.GlobalAdminRouterModule),
        canActivate: [GlobalAdminGuardService],
      },
    ],
  },
];

@NgModule({
  //In order to debug routing set enableTracing to true
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
