import { Component } from '@angular/core';
import {
  LocalAdminModuleSegmentOptions,
  LocalAdminModuleSegmentOptionType,
} from 'src/app/shared/constants/local-admin-module-segment-constants';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { SegmentComponent } from '../../../shared/components/segment/segment.component';
import { NgIf } from '@angular/common';
import { LocalAdminItSystemUsageUiCustomizationComponent } from './local-admin-it-system-usage-ui-customization/local-admin-it-system-usage-ui-customization.component';
import { LocalAdminItSystemUsageOptionTypesComponent } from './local-admin-it-system-usage-option-types/local-admin-it-system-usage-option-types.component';
import { LocalAdminItSystemUsageRoleOptionTypesComponent } from './local-admin-it-system-usage-role-option-types/local-admin-it-system-usage-role-option-types.component';

@Component({
  selector: 'app-local-admin-it-system-usage',
  templateUrl: './local-admin-it-system-usage.component.html',
  styleUrl: './local-admin-it-system-usage.component.scss',
  imports: [
    SegmentComponent,
    NgIf,
    LocalAdminItSystemUsageUiCustomizationComponent,
    LocalAdminItSystemUsageOptionTypesComponent,
    LocalAdminItSystemUsageRoleOptionTypesComponent,
  ],
})
export class LocalAdminItSystemUsageComponent {
  public readonly LocalAdminModuleSegmentOptionType = LocalAdminModuleSegmentOptionType;
  public readonly segmentOptions = LocalAdminModuleSegmentOptions;
  public readonly itSystemUsageModuleKey = UIModuleConfigKey.ItSystemUsage;

  public selectedSegment = LocalAdminModuleSegmentOptionType.UiCustomization;
}
