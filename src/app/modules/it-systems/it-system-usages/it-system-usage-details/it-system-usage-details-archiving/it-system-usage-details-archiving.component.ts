import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ItSystemUsageModuleSegmentOption,
  itSystemUsageModuleSegmentOptions,
} from 'src/app/shared/constants/it-system-usage-module-segment-constants';
import { combineOR } from 'src/app/shared/helpers/observable-helpers';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import {
  selectITSystemUsageEnableCatalogArchiveDuty,
  selectITSystemUsageEnableCatalogArchiveDutyComment,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { SegmentComponent } from '../../../../../shared/components/segment/segment.component';
import { ItSystemUsageDetailsArchivingCatalogComponent } from './it-system-usage-details-archiving-catalog/it-system-usage-details-archiving-catalog.component';
import { ItSystemUsageDetailsArchivingUsageComponent } from './it-system-usage-details-archiving-usage/it-system-usage-details-archiving-usage.component';
import { ItSystemUsageDetailsArchivingComponentStore } from './it-system-usage-details-archiving.component-store';

@Component({
  selector: 'app-it-system-usage-details-archiving',
  templateUrl: './it-system-usage-details-archiving.component.html',
  styleUrls: ['./it-system-usage-details-archiving.component.scss'],
  providers: [ItSystemUsageDetailsArchivingComponentStore],
  imports: [
    CommonModule,
    SegmentComponent,
    ItSystemUsageDetailsArchivingUsageComponent,
    ItSystemUsageDetailsArchivingCatalogComponent,
  ],
})
export class ItSystemUsageDetailsArchivingComponent {
  public ItSystemUsageModuleSegmentOption = ItSystemUsageModuleSegmentOption;
  public selected = ItSystemUsageModuleSegmentOption.Usage;
  public itSystemUsageModuleSegmentOptions = itSystemUsageModuleSegmentOptions;
  public readonly catalogArchiveDutyEnabled$ = this.store.select(selectITSystemUsageEnableCatalogArchiveDuty);
  public readonly catalogArchiveDutyCommentEnabled$ = this.store.select(
    selectITSystemUsageEnableCatalogArchiveDutyComment,
  );

  constructor(private readonly store: Store) {}

  public disableCatalogArchivingSegment() {
    return combineOR([this.catalogArchiveDutyEnabled$, this.catalogArchiveDutyCommentEnabled$]).pipe(
      invertBooleanValue(),
    );
  }
}
