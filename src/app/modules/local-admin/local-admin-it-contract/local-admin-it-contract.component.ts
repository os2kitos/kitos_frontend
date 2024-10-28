import { Component } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
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
  public readonly LocalAdminItContractsSegmentOption = LocalAdminItContractsSegmentOption;

  public selectedSegment: LocalAdminItContractsSegmentOption = LocalAdminItContractsSegmentOption.UiCustomization;

  public readonly segmentOptions: SegmentButtonOption<LocalAdminItContractsSegmentOption>[] = [
    { text: $localize`Lokal tilpasning af brugerfladen`, value: LocalAdminItContractsSegmentOption.UiCustomization },
    { text: $localize`Udfaldsrum`, value: LocalAdminItContractsSegmentOption.RegularOptionTypes },
    { text: $localize`Roller`, value: LocalAdminItContractsSegmentOption.RoleOptionTypes },
  ];

  public readonly itContractsModuleKey = UIModuleConfigKey.ItContract;
}
