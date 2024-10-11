import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ORGANIZATION_SECTION_NAME } from 'src/app/shared/persistent-state-constants';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { selectOrganizationGridData, selectOrganizationGridLoading, selectOrganizationGridState } from 'src/app/store/organization/selectors';

@Component({
  selector: 'app-local-admin-organization',
  templateUrl: './local-admin-organization.component.html',
  styleUrl: './local-admin-organization.component.scss',
})
export class LocalAdminOrganizationComponent extends BaseOverviewComponent {
  private readonly sectionName: string = ORGANIZATION_SECTION_NAME;

  public readonly isLoading$ = this.store.select(selectOrganizationGridLoading);
  public readonly gridData$ = this.store.select(selectOrganizationGridData);
  public readonly gridState$ = this.store.select(selectOrganizationGridState);

  constructor(store: Store) {
    super(store, 'local-admin-organization');
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
      hidden: false,
    },
    {
      field: 'ForeignCvr',
      title: $localize`Udenlandsk virksomhed`,
      section: this.sectionName,
      hidden: false,
    },
  ];

  public readonly gridColumns$ = of(this.gridColumns);

  public stateChange(gridState: GridState) {
    this.store.dispatch(OrganizationActions.updateGridState(gridState));
  }

  public onEditClick(): void {}

  public onDeleteClick(): void {}
}
