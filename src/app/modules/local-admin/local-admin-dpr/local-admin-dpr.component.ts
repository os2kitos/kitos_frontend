import { Component } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';

enum LocalAdminDprSegmentOption {
  RegularOptionTypes = 'RegularOptionTypes',
  RoleOptionTypes = 'RoleOptionTypes',
}

@Component({
  selector: 'app-local-admin-dpr',
  templateUrl: './local-admin-dpr.component.html',
  styleUrl: './local-admin-dpr.component.scss'
})

export class LocalAdminDprComponent {
  public readonly LocalAdminDprSegmentOption = LocalAdminDprSegmentOption;

  public selectedSegment: LocalAdminDprSegmentOption = LocalAdminDprSegmentOption.RegularOptionTypes;

  public readonly segmentOptions: SegmentButtonOption<LocalAdminDprSegmentOption>[] = [
    { text: $localize`Udfaldsrum`, value: LocalAdminDprSegmentOption.RegularOptionTypes },
    { text: $localize`Roller`, value: LocalAdminDprSegmentOption.RoleOptionTypes },
  ];
}
