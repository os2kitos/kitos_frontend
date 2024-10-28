import { Component } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';

enum LocalAdminSystemUsageSegmentOptions {
  UiCustomization = 'UiCustomization',
  RegularOptionTypes = 'RegularOptionTypes',
  RoleOptionTypes = 'RoleOptionTypes',
}

@Component({
  selector: 'app-local-admin-it-system-usage',
  templateUrl: './local-admin-it-system-usage.component.html',
  styleUrl: './local-admin-it-system-usage.component.scss',
})
export class LocalAdminItSystemUsageComponent {
  public readonly LocalAdminSystemUsageSegmentOptions = LocalAdminSystemUsageSegmentOptions;
  public selectedSegment: LocalAdminSystemUsageSegmentOptions = LocalAdminSystemUsageSegmentOptions.UiCustomization;
  public readonly segmentOptions: SegmentButtonOption<LocalAdminSystemUsageSegmentOptions>[] = [
    { text: $localize`Lokal tilpasning af brugerfladen`, value: LocalAdminSystemUsageSegmentOptions.UiCustomization },
    { text: $localize`Lokal tilpasning af udfaldsrum`, value: LocalAdminSystemUsageSegmentOptions.RegularOptionTypes },
    { text: $localize`Lokal tilpasning af roller`, value: LocalAdminSystemUsageSegmentOptions.RoleOptionTypes },
  ];

  public readonly itSystemUsageModuleKey = UIModuleConfigKey.ItSystemUsage;
}
