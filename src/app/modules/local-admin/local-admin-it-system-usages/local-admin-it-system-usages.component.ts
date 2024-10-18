import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { UIModuleCustomizationKey } from 'src/app/shared/enums/ui-module-customization-key';
import {
  collectUIConfigNodeViewModels,
  getItSystemUsageUiBluePrint,
} from 'src/app/shared/models/helpers/ui-config-helpers';
import { UIConfigNodeViewModel } from 'src/app/shared/models/ui-config/ui-config-node-view-model.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { OrganizationUiModuleCustomizationActions } from 'src/app/store/organization/organization-ui-customization/actions';
import { selectITSystemUsagesUIModuleCustomization } from 'src/app/store/organization/organization-ui-customization/selectors';
import { UiModuleConfigCheckboxChangedEvent } from '../ui-config-tab-section/ui-config-tab-section.component';

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
    { text: $localize`Udfaldsrum`, value: LocalAdminSystemUsagesSegmentOptions.OptionTypes },
  ];
  public readonly itSystemUsageUIModuleCustomization$ = this.store.select(selectITSystemUsagesUIModuleCustomization);
  public uiConfigNodeViewModels$: BehaviorSubject<UIConfigNodeViewModel[]> = new BehaviorSubject<
    UIConfigNodeViewModel[]
  >([]);

  public readonly itSystemUsageFrontpageForm = new FormGroup({});

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(
      OrganizationUiModuleCustomizationActions.getUIModuleCustomization({
        moduleName: UIModuleCustomizationKey.ItSystemUsage,
      })
    );
    this.setupUIConfig();
  }

  private setupUIConfig() {
    this.itSystemUsageUIModuleCustomization$.pipe(filterNullish()).subscribe((moduleCustomization) => {
      const blueprint = getItSystemUsageUiBluePrint();

      const moduleCustomizationNodes = moduleCustomization?.nodes ?? [];
      const viewModels = collectUIConfigNodeViewModels(blueprint, moduleCustomizationNodes);
      this.uiConfigNodeViewModels$.next(viewModels);
    });
  }

  public onCheckboxChange($event: UiModuleConfigCheckboxChangedEvent) {
    //todo handle event with put call to update config in store
  }
}
