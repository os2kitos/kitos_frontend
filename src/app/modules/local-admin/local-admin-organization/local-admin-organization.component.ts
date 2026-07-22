import { Component } from '@angular/core';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { SegmentComponent } from '../../../shared/components/segment/segment.component';
import { CardComponent } from '../../../shared/components/card/card.component';

import { OrganizationsGridComponent } from './organizations-grid/organizations-grid.component';
import { OverviewHeaderComponent } from '../../../shared/components/overview-header/overview-header.component';
import { LocalOptionTypeViewComponent } from '../../../shared/components/local-option-type-view/local-option-type-view.component';

enum LocalAdminOrganizationSegmentOption {
  Organizations = 'Organizations',
  Roles = 'Roles',
}

@Component({
  selector: 'app-local-admin-organization',
  templateUrl: './local-admin-organization.component.html',
  styleUrl: './local-admin-organization.component.scss',
  imports: [
    SegmentComponent,
    CardComponent,
    OrganizationsGridComponent,
    OverviewHeaderComponent,
    LocalOptionTypeViewComponent
],
})
export class LocalAdminOrganizationComponent {
  public readonly LocalAdminOrganizationSegmentOption = LocalAdminOrganizationSegmentOption;

  public selectedSegment: LocalAdminOrganizationSegmentOption = LocalAdminOrganizationSegmentOption.Organizations;

  public readonly segmentOptions: SegmentButtonOption<LocalAdminOrganizationSegmentOption>[] = [
    { text: $localize`Organisationer`, value: LocalAdminOrganizationSegmentOption.Organizations },
    { text: $localize`Roller`, value: LocalAdminOrganizationSegmentOption.Roles },
  ];
}
