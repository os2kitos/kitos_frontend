import { Component } from '@angular/core';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { ORGANIZATION_SECTION_NAME } from 'src/app/shared/persistent-state-constants';

@Component({
  selector: 'app-local-admin-organization',
  templateUrl: './local-admin-organization.component.html',
  styleUrl: './local-admin-organization.component.scss',
})
export class LocalAdminOrganizationComponent {
  private readonly sectionName: string = ORGANIZATION_SECTION_NAME;

  public readonly gridColumns: GridColumn[] = [
    {
      field: 'OrganizationName',
      title: $localize`Navn`,
      section: this.sectionName,
      hidden: false,
    },
    {
      field: 'CVR',
      title: $localize`CVR`,
      section: this.sectionName,
      hidden: false,
    },
    {
      field: 'OrganizationType',
      title: $localize`Type`,
      section: this.sectionName,
      hidden: false,
    },
    {
      field: 'ForeignBusiness',
      title: $localize`Udenlandsk virksomhed`,
      section: this.sectionName,
      hidden: false,
    },
  ];
}
