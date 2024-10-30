import { Component } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';

enum LocalAdminOrganizationSegmentOption {
  Organizations = 'Organizations',
  Roles = 'Roles',
}

@Component({
  selector: 'app-local-admin-organization',
  templateUrl: './local-admin-organization.component.html',
  styleUrl: './local-admin-organization.component.scss',
})
export class LocalAdminOrganizationComponent {
  public readonly LocalAdminOrganizationSegmentOption = LocalAdminOrganizationSegmentOption;

  public selectedSegment: LocalAdminOrganizationSegmentOption = LocalAdminOrganizationSegmentOption.Organizations;

  public readonly segmentOptions: SegmentButtonOption<LocalAdminOrganizationSegmentOption>[] = [
    { text: $localize`Organisationer`, value: LocalAdminOrganizationSegmentOption.Organizations },
    { text: $localize`Roller`, value: LocalAdminOrganizationSegmentOption.Roles },
  ];



}
