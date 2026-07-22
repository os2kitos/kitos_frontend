import { Component, Input } from '@angular/core';
import {
  ItSystemUsageModuleSegmentOption,
  itSystemUsageModuleSegmentOptions,
} from 'src/app/shared/constants/it-system-usage-module-segment-constants';
import { SegmentComponent } from '../../../../../shared/components/segment/segment.component';

import { ITSystemUsageDetailsFrontpageInformationComponent } from '../it-system-usage-details-frontpage-information/it-system-usage-details-frontpage-information.component';
import { ITSystemUsageDetailsFrontpageCatalogComponent } from '../it-system-usage-details-frontpage-catalog/it-system-usage-details-frontpage-catalog.component';

@Component({
  templateUrl: 'it-system-usage-details-frontpage.component.html',
  styleUrls: ['it-system-usage-details-frontpage.component.scss'],
  imports: [
    SegmentComponent,
    ITSystemUsageDetailsFrontpageInformationComponent,
    ITSystemUsageDetailsFrontpageCatalogComponent
],
})
export class ITSystemUsageDetailsFrontpageComponent {
  public ItSystemUsageModuleSegmentOption = ItSystemUsageModuleSegmentOption;
  @Input() public selected = ItSystemUsageModuleSegmentOption.Usage;
  public itSystemUsageModuleSegmentOptions = itSystemUsageModuleSegmentOptions;
}
