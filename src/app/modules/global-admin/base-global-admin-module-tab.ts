import { Component } from "@angular/core";
import { GlobalAdminModuleSegmentOptions, GlobalAdminModuleSegmentOptionType } from "src/app/shared/constants/global-admin-module-segment-constants";

@Component({
  template: ''
})
export class BaseGlobalAdminModuleTabComponent {
  public readonly GlobalAdminModuleSegmentOptionType = GlobalAdminModuleSegmentOptionType;
  public readonly segmentOptions = GlobalAdminModuleSegmentOptions;

  public selectedSegment = GlobalAdminModuleSegmentOptionType.RegularOptionTypes;
}
