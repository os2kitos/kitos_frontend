import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { CookieModule } from 'ngx-cookie';
import { ButtonComponent } from './components/button/button.component';
import { GridComponent } from './components/grid/grid.component';
import { IconModule } from './components/icons/icons.module';
import { LoadingComponent } from './components/loading/loading.component';
import { NotificationComponent } from './components/notification/notification.component';
import { HideInProdDirective } from './directives/hide-in-prod.directive';
import { HttpXSRFInterceptor } from './interceptors/HttpXSRF.interceptor';

@NgModule({
  declarations: [ButtonComponent, GridComponent, LoadingComponent, HideInProdDirective, NotificationComponent],
  imports: [
    CommonModule,
    RouterModule,
    ButtonsModule,
    GridModule,
    IndicatorsModule,
    RippleModule,
    DialogModule,
    IconModule,
    NotificationModule,
    NgSelectModule,
    CookieModule.withOptions(),
  ],
  exports: [
    CommonModule,
    ButtonComponent,
    GridComponent,
    LoadingComponent,
    HideInProdDirective,
    DialogModule,
    IconModule,
    NgSelectModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpXSRFInterceptor, multi: true }],
})
export class SharedModule {}
