import { NgModule } from '@angular/core';
import { ChevronDownIconComponent } from './chevron-down-icon.component';
import { ExportIconComponent } from './export-icon.component';
import { KitosKIconComponent } from './kitos-k-icon.component';
import { LogoutIconComponent } from './logout-icon.component';
import { MoreHorizontalIconComponent } from './more-horizontal-icon.component';
import { NotificationIconComponent } from './notification-icon.component';
import { TableIconComponent } from './table-icon.component';
import { XIconComponent } from './x-icon.component';

@NgModule({
  imports: [],
  exports: [
    ChevronDownIconComponent,
    TableIconComponent,
    ExportIconComponent,
    MoreHorizontalIconComponent,
    NotificationIconComponent,
    KitosKIconComponent,
    XIconComponent,
    LogoutIconComponent,
  ],
  declarations: [
    ChevronDownIconComponent,
    TableIconComponent,
    ExportIconComponent,
    MoreHorizontalIconComponent,
    NotificationIconComponent,
    KitosKIconComponent,
    XIconComponent,
    LogoutIconComponent,
  ],
  providers: [],
})
export class IconModule {}