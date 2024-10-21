import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APICustomizedUINodeDTO } from 'src/app/api/v1';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UINodeCustomization } from 'src/app/shared/models/ui-config/ui-node-customization';
import { UIModuleConfigActions } from 'src/app/store/organization/ui-module-customization/actions';
import { selectITSystemUsageUIModuleConfig } from 'src/app/store/organization/ui-module-customization/selectors';

enum LocalAdminSystemUsagesSegmentOptions {
  UiCustomization = 'UiCustomization',
  OptionTypes = 'OptionTypes',
}

@Component({
  selector: 'app-local-admin-it-system-usage',
  templateUrl: './local-admin-it-system-usage.component.html',
  styleUrl: './local-admin-it-system-usage.component.scss',
})
export class LocalAdminItSystemUsageComponent implements OnInit {
  public readonly LocalAdminSystemUsagesSegmentOptions = LocalAdminSystemUsagesSegmentOptions;
  public selectedSegment: LocalAdminSystemUsagesSegmentOptions = LocalAdminSystemUsagesSegmentOptions.UiCustomization;
  public readonly segmentOptions: SegmentButtonOption<LocalAdminSystemUsagesSegmentOptions>[] = [
    { text: $localize`Lokal tilpasning af brugerfladen`, value: LocalAdminSystemUsagesSegmentOptions.UiCustomization },
    { text: $localize`Lokal tilpasning af udfaldsrum`, value: LocalAdminSystemUsagesSegmentOptions.OptionTypes },
  ];
  public readonly itSystemUsageUIModuleConfig$ = this.store.select(selectITSystemUsageUIModuleConfig);
  private readonly itSystemUsageModuleKey = UIModuleConfigKey.ItSystemUsage;
  public readonly itSystemUsageFrontpageForm = new FormGroup({});

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(
      UIModuleConfigActions.getUIModuleConfig({
        module: this.itSystemUsageModuleKey,
      })
    );
  }

  public onCheckboxChange($event: UINodeCustomization) {
    const dto: APICustomizedUINodeDTO = { enabled: $event.enabled, key: $event.fullKey };
    this.store.dispatch(
      UIModuleConfigActions.putUIModuleCustomization({ module: this.itSystemUsageModuleKey, updatedNodeRequest: dto })
    );
  }
}
