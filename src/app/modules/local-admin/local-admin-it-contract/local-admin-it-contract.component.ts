import { Component } from '@angular/core';
import { LocalAdminModuleSegmentOptions, LocalAdminModuleSegmentOptionType } from 'src/app/shared/constants/local-admin-module-segment-constants';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { Component,  } from '@angular/core';
import { Store } from '@ngrx/store';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { selectShowItContractModule } from 'src/app/store/organization/selectors';

@Component({
  selector: 'app-local-admin-it-contract',
  templateUrl: './local-admin-it-contract.component.html',
  styleUrl: './local-admin-it-contract.component.scss',
})
export class LocalAdminItContractComponent {
  public readonly LocalAdminModuleSegmentOptionType = LocalAdminModuleSegmentOptionType;
  public readonly segmentOptions = LocalAdminModuleSegmentOptions;
  public readonly itContractsModuleKey = UIModuleConfigKey.ItContract;
  public readonly showItContractModule$ = this.store.select(selectShowItContractModule);

  public selectedSegment = LocalAdminModuleSegmentOptionType.UiCustomization;

  constructor(private readonly store: Store, private readonly notificationService: NotificationService) {
  }
}
