import { Component } from '@angular/core';
import { GlobalAdminModuleSegmentOptions, GlobalAdminModuleSegmentOptionType } from 'src/app/shared/constants/global-admin-module-segment-constants';

@Component({
  selector: 'app-global-admin-it-system',
  templateUrl: './global-admin-it-system.component.html',
  styleUrl: './global-admin-it-system.component.scss'
})
export class GlobalAdminItSystemComponent {
  public readonly GlobalAdminModuleSegmentOptionType = GlobalAdminModuleSegmentOptionType;
  public readonly segmentOptions = GlobalAdminModuleSegmentOptions;

  public selectedSegment = GlobalAdminModuleSegmentOptionType.RegularOptionTypes;
}
