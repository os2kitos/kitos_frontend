import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@progress/kendo-angular-grid';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { NotificationDetailsItSystemUsagesComponent } from './notification-details/notification-details-it-system-usages/notification-details-it-system-usages.component';
import { NotificationDetailsComponent } from './notification-details/notification-details.component';
import { NotifcationsRouterModule } from './notifications.routes';
import { NotificationDetailsItContractsComponent } from './notification-details/notification-details-it-contracts/notification-details-it-contracts.component';
import { NotificationDetailsDataProcessingComponent } from './notification-details/notification-details-data-processing/notification-details-data-processing.component';
import { NotificationsPageComponent } from './notification-details/notifications-page/notifications-page.component';
import { NotificationsGridComponent } from './notification-details/notifications-page/notifications-grid/notifications-grid.component';
import { AlertsGridComponent } from './notification-details/notifications-page/alerts-grid/alerts-grid.component';

@NgModule({
  declarations: [
    NotificationDetailsComponent,
    NotificationDetailsItSystemUsagesComponent,
    NotificationDetailsItContractsComponent,
    NotificationDetailsDataProcessingComponent,
    NotificationsPageComponent,
    NotificationsGridComponent,
    AlertsGridComponent,
  ],
  imports: [CommonModule, ComponentsModule, RouterModule, SharedModule, NotifcationsRouterModule],
})
export class NotifcationsModule {}
