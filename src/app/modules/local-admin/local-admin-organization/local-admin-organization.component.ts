import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, of } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { SegmentButtonOption } from 'src/app/shared/components/segment/segment.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { organizationTypeOptions } from 'src/app/shared/models/organization/organization.model';
import { ORGANIZATION_SECTION_NAME } from 'src/app/shared/persistent-state-constants';
import { OrganizationActions } from 'src/app/store/organization/actions';
import {
  selectOrganizationGridData,
  selectOrganizationGridLoading,
  selectOrganizationGridState,
} from 'src/app/store/organization/selectors';

enum LocalAdminOrganizationOption {
  Organizations = 'Organizations',
  Roles = 'Roles',
}

@Component({
  selector: 'app-local-admin-organization',
  templateUrl: './local-admin-organization.component.html',
  styleUrl: './local-admin-organization.component.scss',
})
export class LocalAdminOrganizationComponent extends BaseOverviewComponent implements OnInit {
  public readonly LocalAdminOrganizationOption = LocalAdminOrganizationOption;

  public selected: LocalAdminOrganizationOption = LocalAdminOrganizationOption.Organizations;

  private readonly sectionName: string = ORGANIZATION_SECTION_NAME;

  public readonly isLoading$ = this.store.select(selectOrganizationGridLoading);
  public readonly gridData$ = this.store.select(selectOrganizationGridData);
  public readonly gridState$ = this.store.select(selectOrganizationGridState);


  constructor(store: Store) {
    super(store, 'local-admin-organization');
  }

  ngOnInit() {
    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));
  }

  public readonly gridColumns: GridColumn[] = [
    {
      field: 'Name',
      title: $localize`Navn`,
      section: this.sectionName,
      hidden: false,
    },
    {
      field: 'Cvr',
      title: $localize`CVR`,
      section: this.sectionName,
      hidden: false,
    },
    {
      field: 'TypeId',
      title: $localize`Type`,
      section: this.sectionName,
      extraFilter: 'enum',
      extraData: organizationTypeOptions,
      hidden: false,
    },
    {
      field: 'ForeignBusiness',
      title: $localize`Udenlandsk virksomhed`,
      section: this.sectionName,
      hidden: false,
    },
  ];

  public readonly gridColumns$ = of(this.gridColumns);

  public readonly segmentOptions: SegmentButtonOption<LocalAdminOrganizationOption>[] = [
    { text: $localize`Organisationer`, value: LocalAdminOrganizationOption.Organizations },
    { text: $localize`Roller`, value: LocalAdminOrganizationOption.Roles },
  ];

  public stateChange(gridState: GridState) {
    this.store.dispatch(OrganizationActions.updateGridState(gridState));
  }

  public onEditClick(): void {}

  public onDeleteClick(): void {}

  public getGridTitle(): string {
    switch (this.selected) {
      case LocalAdminOrganizationOption.Organizations:
        return $localize`Organisationer i Kitos`;
      case LocalAdminOrganizationOption.Roles:
        return $localize`Roller i din organisation`;
    }
  }
}
