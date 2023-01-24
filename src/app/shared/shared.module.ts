import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { ButtonComponent } from './components/button/button.component';
import { GridComponent } from './components/grid/grid.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NotificationComponent } from './components/notification/notification.component';
import { HideInProdDirective } from './directives/hide-in-prod.directive';

@NgModule({
  declarations: [ButtonComponent, GridComponent, LoadingComponent, HideInProdDirective, NotificationComponent],
  imports: [CommonModule, RouterModule, ButtonsModule, GridModule, IndicatorsModule, RippleModule, NotificationModule],
  exports: [ButtonComponent, GridComponent, LoadingComponent, HideInProdDirective],
  entryComponents: [NotificationComponent],
})
export class SharedModule {}
