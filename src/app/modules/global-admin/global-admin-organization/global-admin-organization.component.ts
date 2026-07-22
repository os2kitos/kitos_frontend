import { Component } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { SegmentComponent } from '../../../shared/components/segment/segment.component';
import { CardComponent } from '../../../shared/components/card/card.component';

import { StandardVerticalContentGridComponent } from '../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { GlobalOptionTypeViewComponent } from '../../../shared/components/global-option-type-view/global-option-type-view.component';

enum GlobalAdminOrganizationSegmentOptionType {
  CountryCodes = 'CountryCodes',
  RoleOptionTypes = 'RoleOptionTypes',
}

@Component({
  selector: 'app-global-admin-organization',
  templateUrl: './global-admin-organization.component.html',
  styleUrl: './global-admin-organization.component.scss',
  imports: [SegmentComponent, CardComponent, StandardVerticalContentGridComponent, GlobalOptionTypeViewComponent],
})
export class GlobalAdminOrganizationComponent {
  public readonly GlobalAdminOrganizationSegmentOptionType = GlobalAdminOrganizationSegmentOptionType;
  public segmentOptions: SegmentButtonOption<GlobalAdminOrganizationSegmentOptionType>[] = [
    { text: $localize`Tilpasning af landekoder`, value: GlobalAdminOrganizationSegmentOptionType.CountryCodes },
    { text: $localize`Tilpasning af roller`, value: GlobalAdminOrganizationSegmentOptionType.RoleOptionTypes },
  ];

  public selectedSegment = GlobalAdminOrganizationSegmentOptionType.CountryCodes;
}
