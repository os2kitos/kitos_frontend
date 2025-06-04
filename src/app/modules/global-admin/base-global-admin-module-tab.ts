import { Component } from '@angular/core';
import {
  GlobalAdminModuleSegmentOptions,
  GlobalAdminModuleSegmentOptionType,
} from 'src/app/shared/constants/global-admin-module-segment-constants';

@Component({
  template: '',
  host: { 'global-admin-module-tab': 'base-class' },
  standalone: false,
})
export class BaseGlobalAdminModuleTabComponent {
  public readonly GlobalAdminModuleSegmentOptionType = GlobalAdminModuleSegmentOptionType;
  public readonly segmentOptions = GlobalAdminModuleSegmentOptions;

  public selectedSegment = GlobalAdminModuleSegmentOptionType.RegularOptionTypes;
}
