import { Component } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { selectShowDataProcessingRegistrations } from 'src/app/store/organization/selectors';
import { selectDataProcessingUIModuleConfig } from 'src/app/store/organization/ui-module-customization/selectors';
import { Store } from '@ngrx/store';
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
    { text: $localize`Lokal tilpasning af udfaldsrum`, value: LocalAdminDprSegmentOption.RegularOptionTypes },
    { text: $localize`Lokal tilpasning af roller`, value: LocalAdminDprSegmentOption.RoleOptionTypes },
  ];

  public readonly showDataProcessingModule$ = this.store.select(selectShowDataProcessingRegistrations);
  public readonly dataProcessingUIModuleConfig$ = this.store.select(selectDataProcessingUIModuleConfig);
  public readonly dataProcessingModuleKey = UIModuleConfigKey.DataProcessingRegistrations;

  constructor(private readonly store: Store, private readonly notificationService: NotificationService) {}

  public patchUIRootConfig($event: boolean) {
    this.store.dispatch(OrganizationActions.patchUIRootConfig({ dto: { showDataProcessing: $event } }));
  }
}
