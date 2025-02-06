import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, of } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { ORGANIZATION_SECTION_NAME } from 'src/app/shared/constants/persistent-state-constants';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { organizationTypeOptions } from 'src/app/shared/models/organization/organization-odata.model';
import { OrganizationActions } from 'src/app/store/organization/actions';
import {
  selectOrganizationGridData,
  selectOrganizationGridLoading,
  selectOrganizationGridState,
} from 'src/app/store/organization/selectors';

@Component({
  selector: 'app-organizations-grid',
  templateUrl: './organizations-grid.component.html',
  styleUrl: './organizations-grid.component.scss',
})
export class OrganizationsGridComponent extends BaseOverviewComponent implements OnInit {
  private readonly sectionName: string = ORGANIZATION_SECTION_NAME;

  public readonly isLoading$ = this.store.select(selectOrganizationGridLoading);
  public readonly gridData$ = this.store.select(selectOrganizationGridData);
  public readonly gridState$ = this.store.select(selectOrganizationGridState);
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
      field: 'OrganizationType',
      title: $localize`Type`,
      section: this.sectionName,
      extraFilter: 'enum',
      extraData: organizationTypeOptions,
      hidden: false,
    },
    {
      field: 'ForeignCountryCode.Name',
      title: $localize`Udenlandsk virksomhed`,
      section: this.sectionName,
      hidden: false,
    },
  ];

  public readonly gridColumns$ = of(this.gridColumns);

  constructor(store: Store) {
    super(store, 'local-admin-organization');
  }
  ngOnInit() {
    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(OrganizationActions.updateGridState(gridState));
  }
}
