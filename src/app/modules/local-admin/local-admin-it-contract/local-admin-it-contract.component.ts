import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UIRootConfigActions } from 'src/app/store/local-admin/ui-root-config/actions';

enum LocalAdminItContractsSegmentOption {
  RegularOptionTypes = 'RegularOptionTypes',
  RoleOptionTypes = 'RoleOptionTypes',
}

@Component({
  selector: 'app-local-admin-it-contract',
  templateUrl: './local-admin-it-contract.component.html',
  styleUrl: './local-admin-it-contract.component.scss',
})
export class LocalAdminItContractComponent implements OnInit {
  public readonly LocalAdminItContractsSegmentOption = LocalAdminItContractsSegmentOption;

  public selectedSegment: LocalAdminItContractsSegmentOption = LocalAdminItContractsSegmentOption.RegularOptionTypes;

  public readonly segmentOptions: SegmentButtonOption<LocalAdminItContractsSegmentOption>[] = [
    { text: $localize`Udfaldsrum`, value: LocalAdminItContractsSegmentOption.RegularOptionTypes },
    { text: $localize`Roller`, value: LocalAdminItContractsSegmentOption.RoleOptionTypes },
  ];

  constructor(private readonly store: Store){}

  ngOnInit(): void {
    this.store.dispatch(UIRootConfigActions.setCurrentTabModuleKey({ moduleKey: UIModuleConfigKey.ItContract }));
  }
}
