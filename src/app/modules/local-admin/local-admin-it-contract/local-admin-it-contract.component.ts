import { Component } from '@angular/core';
import { LocalAdminModuleSegmentOptions, LocalAdminModuleSegmentOptionType } from 'src/app/shared/constants/local-admin-module-segment-constants';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';

enum LocalAdminItContractsSegmentOption {
  UiCustomization = 'UiCustomization',
  RegularOptionTypes = 'RegularOptionTypes',
  RoleOptionTypes = 'RoleOptionTypes',
}

@Component({
  selector: 'app-local-admin-it-contract',
  templateUrl: './local-admin-it-contract.component.html',
  styleUrl: './local-admin-it-contract.component.scss',
})
export class LocalAdminItContractComponent {
  public readonly LocalAdminModuleSegmentOptionType = LocalAdminModuleSegmentOptionType;
  public readonly segmentOptions = LocalAdminModuleSegmentOptions;
  public readonly itContractsModuleKey = UIModuleConfigKey.ItContract;

  public selectedSegment = LocalAdminModuleSegmentOptionType.UiCustomization;
}
