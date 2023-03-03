import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ITSystemUsageDetailsContractsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-contracts/it-system-usage-details-contracts.component';
import { ITSystemUsageDetailsFrontpageCatalogComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-frontpage-catalog/it-system-usage-details-frontpage-catalog.component';
import { ITSystemUsageDetailsFrontpageInformationComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-frontpage-information/it-system-usage-details-frontpage-information.component';
import { ITSystemUsageDetailsFrontpageComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details-frontpage/it-system-usage-details-frontpage.component';
import { ITSystemUsageDetailsComponent } from './it-system-usages/it-system-usage-details/it-system-usage-details.component';
import { ITSystemUsageRemoveComponent } from './it-system-usages/it-system-usage-details/it-system-usage-remove/it-system-usage-remove.component';
import { ITSystemUsagesComponent } from './it-system-usages/it-system-usages.component';
import { ITSystemsRouterModule } from './it-systems.routes';

@NgModule({
  declarations: [
    ITSystemUsagesComponent,
    ITSystemUsageDetailsComponent,
    ITSystemUsageDetailsFrontpageComponent,
    ITSystemUsageDetailsContractsComponent,
    ITSystemUsageRemoveComponent,
    ITSystemUsageDetailsFrontpageInformationComponent,
    ITSystemUsageDetailsFrontpageCatalogComponent,
  ],
  imports: [CommonModule, SharedModule, ITSystemsRouterModule],
})
export class ItSystemsModule {}
