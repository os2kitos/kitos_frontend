import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { CustomizedUINode } from 'src/app/shared/models/ui-config/customized-ui-node.model';
import { UIModuleConfigActions } from 'src/app/store/organization/ui-module-customization/actions';
import { selectITSystemUsagesUIModuleConfig } from 'src/app/store/organization/ui-module-customization/selectors';

enum LocalAdminSystemUsagesSegmentOptions {
  UiCustomization = 'UiCustomization',
  OptionTypes = 'OptionTypes',
}

@Component({
  selector: 'app-local-admin-it-system-usages',
  templateUrl: './local-admin-it-system-usages.component.html',
  styleUrl: './local-admin-it-system-usages.component.scss',
})
export class LocalAdminItSystemUsagesComponent implements OnInit {
  public readonly LocalAdminSystemUsagesSegmentOptions = LocalAdminSystemUsagesSegmentOptions;
  public selectedSegment: LocalAdminSystemUsagesSegmentOptions = LocalAdminSystemUsagesSegmentOptions.UiCustomization;
  public readonly segmentOptions: SegmentButtonOption<LocalAdminSystemUsagesSegmentOptions>[] = [
    { text: $localize`Lokal tilpasning af brugerfladen`, value: LocalAdminSystemUsagesSegmentOptions.UiCustomization },
    { text: $localize`Lokal tilpasning af udfaldsrum`, value: LocalAdminSystemUsagesSegmentOptions.OptionTypes },
  ];
  public readonly itSystemUsageUIModuleConfig$ = this.store.select(selectITSystemUsagesUIModuleConfig);

  public readonly itSystemUsageFrontpageForm = new FormGroup({});

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(
      UIModuleConfigActions.getUIModuleCustomization({
        module: UIModuleConfigKey.ItSystemUsage,
      })
    );
  }

  public onCheckboxChange($event: CustomizedUINode) {
    //todo call put on store
  }
}
