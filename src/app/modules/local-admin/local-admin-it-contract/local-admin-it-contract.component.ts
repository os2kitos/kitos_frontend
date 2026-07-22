import { Component } from '@angular/core';
import {
  LocalAdminModuleSegmentOptions,
  LocalAdminModuleSegmentOptionType,
} from 'src/app/shared/constants/local-admin-module-segment-constants';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { SegmentComponent } from '../../../shared/components/segment/segment.component';
import { CardComponent } from '../../../shared/components/card/card.component';

import { UiConfigComponent } from '../ui-config/ui-config.component';
import { StandardVerticalContentGridComponent } from '../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { LocalOptionTypeViewComponent } from '../../../shared/components/local-option-type-view/local-option-type-view.component';

@Component({
  selector: 'app-local-admin-it-contract',
  templateUrl: './local-admin-it-contract.component.html',
  styleUrl: './local-admin-it-contract.component.scss',
  imports: [
    SegmentComponent,
    CardComponent,
    UiConfigComponent,
    StandardVerticalContentGridComponent,
    LocalOptionTypeViewComponent
],
})
export class LocalAdminItContractComponent {
  public readonly LocalAdminModuleSegmentOptionType = LocalAdminModuleSegmentOptionType;
  public readonly segmentOptions = LocalAdminModuleSegmentOptions;
  public readonly itContractsModuleKey = UIModuleConfigKey.ItContract;

  public selectedSegment = LocalAdminModuleSegmentOptionType.UiCustomization;
}
