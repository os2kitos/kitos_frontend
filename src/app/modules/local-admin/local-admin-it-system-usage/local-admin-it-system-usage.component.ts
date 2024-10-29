import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { APICustomizedUINodeRequestDTO } from 'src/app/api/v2';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UINodeCustomization } from 'src/app/shared/models/ui-config/ui-node-customization';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { selectShowItSystemModule } from 'src/app/store/organization/selectors';
import { UIModuleConfigActions } from 'src/app/store/organization/ui-module-customization/actions';
import { selectITSystemUsageUIModuleConfig } from 'src/app/store/organization/ui-module-customization/selectors';

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
  public readonly itSystemUsageUIModuleConfig$ = this.store.select(selectITSystemUsageUIModuleConfig);
  public readonly showItSystemModule$ = this.store.select(selectShowItSystemModule);
  public readonly itSystemUsageModuleKey = UIModuleConfigKey.ItSystemUsage;

  constructor(private readonly store: Store, private readonly notificationService: NotificationService) {
  }
}
