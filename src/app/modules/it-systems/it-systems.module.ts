import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ITSystemUsageDetailsComponent } from './it-system-usages/it-system-details/it-system-usage-details.component';
import { ITSystemUsagesComponent } from './it-system-usages/it-system-usages.component';
import { ITSystemsRouterModule } from './it-systems.routes';

@NgModule({
  declarations: [ITSystemUsagesComponent, ITSystemUsageDetailsComponent],
  imports: [CommonModule, SharedModule, ITSystemsRouterModule],
})
export class ItSystemsModule {}
