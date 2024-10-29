import { Component } from '@angular/core';
import { LocalAdminModuleSegmentOptions, LocalAdminModuleSegmentOptionType } from 'src/app/shared/constants/local-admin-module-segment-constants';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { selectShowDataProcessingRegistrations } from 'src/app/store/organization/selectors';
import { selectDataProcessingUIModuleConfig } from 'src/app/store/organization/ui-module-customization/selectors';
import { Store } from '@ngrx/store';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';

@Component({
  selector: 'app-local-admin-dpr',
  templateUrl: './local-admin-dpr.component.html',
  styleUrl: './local-admin-dpr.component.scss',
})
export class LocalAdminDprComponent {
  public readonly LocalAdminModuleSegmentOptionType = LocalAdminModuleSegmentOptionType;
  public readonly segmentOptions = LocalAdminModuleSegmentOptions;
  public readonly dataProcessingModuleKey = UIModuleConfigKey.DataProcessingRegistrations;

  public selectedSegment = LocalAdminModuleSegmentOptionType.UiCustomization;

  public readonly showDataProcessingModule$ = this.store.select(selectShowDataProcessingRegistrations);
  public readonly dataProcessingUIModuleConfig$ = this.store.select(selectDataProcessingUIModuleConfig);

  constructor(private readonly store: Store, private readonly notificationService: NotificationService) {}

  public patchUIRootConfig($event: boolean) {
    this.store.dispatch(OrganizationActions.patchUIRootConfig({ dto: { showDataProcessing: $event } }));
  }
}
