import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { UIRootConfigActions } from 'src/app/store/local-admin/ui-root-config/actions';

enum LocalAdminOrganizationSegmentOption {
  Organizations = 'Organizations',
  Roles = 'Roles',
}

@Component({
  selector: 'app-local-admin-organization',
  templateUrl: './local-admin-organization.component.html',
  styleUrl: './local-admin-organization.component.scss',
})
export class LocalAdminOrganizationComponent implements OnInit {
  public readonly LocalAdminOrganizationSegmentOption = LocalAdminOrganizationSegmentOption;

  public selectedSegment: LocalAdminOrganizationSegmentOption = LocalAdminOrganizationSegmentOption.Organizations;

  public readonly segmentOptions: SegmentButtonOption<LocalAdminOrganizationSegmentOption>[] = [
    { text: $localize`Organisationer`, value: LocalAdminOrganizationSegmentOption.Organizations },
    { text: $localize`Roller`, value: LocalAdminOrganizationSegmentOption.Roles },
  ];

  constructor(private readonly store: Store){}
  ngOnInit(): void {
    this.store.dispatch(UIRootConfigActions.setCurrentTabModuleKey({ moduleKey: undefined }));

  }


}
