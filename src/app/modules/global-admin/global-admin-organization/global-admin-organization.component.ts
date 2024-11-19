import { Component } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';

enum GlobalAdminOrganizationSegmentOptionType {
  CountryCodes = 'CountryCodes',
  RoleOptionTypes = 'RoleOptionTypes',
}


@Component({
  selector: 'app-global-admin-organization',
  templateUrl: './global-admin-organization.component.html',
  styleUrl: './global-admin-organization.component.scss'
})
export class GlobalAdminOrganizationComponent {
  public readonly GlobalAdminOrganizationSegmentOptionType = GlobalAdminOrganizationSegmentOptionType;
  public segmentOptions: SegmentButtonOption<GlobalAdminOrganizationSegmentOptionType>[] = [
    { text: $localize`Tilpasning af landekoder`, value: GlobalAdminOrganizationSegmentOptionType.CountryCodes },
    { text: $localize`Tilpasning af roller`, value: GlobalAdminOrganizationSegmentOptionType.RoleOptionTypes },
  ];

  public selectedSegment = GlobalAdminOrganizationSegmentOptionType.CountryCodes;

}
