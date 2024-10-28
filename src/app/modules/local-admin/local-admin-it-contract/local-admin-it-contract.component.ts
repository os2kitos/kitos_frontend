import { Component,  } from '@angular/core';
import { Store } from '@ngrx/store';
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
    { text: $localize`Udfaldsrum`, value: LocalAdminItContractsSegmentOption.RegularOptionTypes },
    { text: $localize`Roller`, value: LocalAdminItContractsSegmentOption.RoleOptionTypes },
  ];

}
