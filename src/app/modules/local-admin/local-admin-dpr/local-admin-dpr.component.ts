import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UIRootConfigActions } from 'src/app/store/local-admin/ui-root-config/actions';

enum LocalAdminDprSegmentOption {
  RegularOptionTypes = 'RegularOptionTypes',
  RoleOptionTypes = 'RoleOptionTypes',
}

@Component({
  selector: 'app-local-admin-dpr',
  templateUrl: './local-admin-dpr.component.html',
  styleUrl: './local-admin-dpr.component.scss'
})

export class LocalAdminDprComponent implements OnInit{
  public readonly LocalAdminDprSegmentOption = LocalAdminDprSegmentOption;

  public selectedSegment: LocalAdminDprSegmentOption = LocalAdminDprSegmentOption.RegularOptionTypes;

  public readonly segmentOptions: SegmentButtonOption<LocalAdminDprSegmentOption>[] = [
    { text: $localize`Udfaldsrum`, value: LocalAdminDprSegmentOption.RegularOptionTypes },
    { text: $localize`Roller`, value: LocalAdminDprSegmentOption.RoleOptionTypes },
  ];

  constructor(private readonly store: Store){}

  ngOnInit(): void {
    this.store.dispatch(UIRootConfigActions.setCurrentTabModuleKey({ moduleKey: UIModuleConfigKey.DataProcessingRegistrations }));
  }
}
