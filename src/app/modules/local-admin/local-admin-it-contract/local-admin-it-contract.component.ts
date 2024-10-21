import { Component } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';

enum LocalAdminItContractsSegmentOption {
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

  public selectedSegment: LocalAdminItContractsSegmentOption = LocalAdminItContractsSegmentOption.RegularOptionTypes;

  public readonly segmentOptions: SegmentButtonOption<LocalAdminItContractsSegmentOption>[] = [
    { text: $localize`It kontrakt udfaldsrum`, value: LocalAdminItContractsSegmentOption.RegularOptionTypes },
    { text: $localize`It kontrakt roller`, value: LocalAdminItContractsSegmentOption.RoleOptionTypes },
  ];
}
