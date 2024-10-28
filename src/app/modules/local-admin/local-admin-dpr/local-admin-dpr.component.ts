import { Component } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';

enum LocalAdminDprSegmentOption {
  UiCustomization = 'UiCustomization',
  RegularOptionTypes = 'RegularOptionTypes',
  RoleOptionTypes = 'RoleOptionTypes',
}

@Component({
  selector: 'app-local-admin-dpr',
  templateUrl: './local-admin-dpr.component.html',
  styleUrl: './local-admin-dpr.component.scss',
})
export class LocalAdminDprComponent {
  public readonly LocalAdminDprSegmentOption = LocalAdminDprSegmentOption;

  public selectedSegment: LocalAdminDprSegmentOption = LocalAdminDprSegmentOption.UiCustomization;

  public readonly segmentOptions: SegmentButtonOption<LocalAdminDprSegmentOption>[] = [
    { text: $localize`Lokal tilpasning af brugerfladen`, value: LocalAdminDprSegmentOption.UiCustomization },
    { text: $localize`Udfaldsrum`, value: LocalAdminDprSegmentOption.RegularOptionTypes },
    { text: $localize`Roller`, value: LocalAdminDprSegmentOption.RoleOptionTypes },
  ];

  public readonly dataProcessingModuleKey = UIModuleConfigKey.DataProcessingRegistrations;

}
