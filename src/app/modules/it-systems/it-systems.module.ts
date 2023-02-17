import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ITSystemUsageDetailsContractsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-contracts/it-system-usage-details-contracts.component';
import { ITSystemUsageDetailsFrontpageComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-frontpage/it-system-usage-details-frontpage.component';
import { ITSystemUsageDetailsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details.component';
import { ITSystemUsagesComponent } from './it-system-usages/it-system-usages.component';
import { ITSystemsRouterModule } from './it-systems.routes';

@NgModule({
  declarations: [
    ITSystemUsagesComponent,
    ITSystemUsageDetailsComponent,
    ITSystemUsageDetailsFrontpageComponent,
    ITSystemUsageDetailsContractsComponent,
  ],
  imports: [CommonModule, SharedModule, ITSystemsRouterModule],
})
export class ItSystemsModule {}
