import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { first } from 'rxjs/operators';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import {
  ORGANIZATION_USER_COLUMNS_ID,
  ORGANIZATION_USER_SECTION_NAME,
} from 'src/app/shared/persistent-state-constants';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { OrganizationUserActions } from 'src/app/store/organization-user/actions';
import {
  selectOrganizationUserGridColumns,
  selectOrganizationUserGridData,
  selectOrganizationUserGridLoading,
  selectOrganizationUserGridState,
} from 'src/app/store/organization-user/selectors';

@Component({
  selector: 'app-organization-users',
  templateUrl: './organization-users.component.html',
  styleUrl: './organization-users.component.scss',
})
export class OrganizationUsersComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectOrganizationUserGridLoading);
  public readonly gridData$ = this.store.select(selectOrganizationUserGridData);
  public readonly gridState$ = this.store.select(selectOrganizationUserGridState);
  public readonly gridColumns$ = this.store.select(selectOrganizationUserGridColumns);

  private readonly organizationUserSectionName = ORGANIZATION_USER_SECTION_NAME;

  private readonly defaultGridColumns: GridColumn[] = [
    {
      field: 'Name',
      title: $localize`Navn`,
      section: this.organizationUserSectionName,
      style: 'primary',
      hidden: false,
      required: true,
      width: 350,
    },
    {
      field: 'Email',
      title: $localize`Email`,
      section: this.organizationUserSectionName,
      style: 'primary',
      hidden: false,
      width: 350,
    },
    {
      field: 'ObjectOwner.Name',
      title: $localize`Sidst redigeret: Bruger`,
      section: this.organizationUserSectionName,
      hidden: false,
      width: 350,
    },
    {
      field: 'Roles',
      title: $localize`Rolle`,
      section: this.organizationUserSectionName,
      hidden: true,
      noFilter: true,
    },
    {
      field: 'HasApiAccess',
      title: $localize`API bruger`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
    },
    {
      field: 'IsLocalAdmin',
      title: $localize`Lokal Admin`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
    },
    {
      field: 'IsOrganizationModuleAdmin',
      title: $localize`Organisations Admin`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
    },
    {
      field: 'IsSystemModuleAdmin',
      title: $localize`System Admin`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
    },
    {
      field: 'IsContractModuleAdmin',
      title: $localize`Kontrakt Admin`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
    },
    {
      field: 'HasRightsHolderAccess',
      title: $localize`Rettighedshaveradgang`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
    },
    {
      field: 'HasStakeHolderAccess',
      title: $localize`Interessentadgang`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
    },
  ];

  constructor(
    store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private statePersistingService: StatePersistingService
  ) {
    super(store, 'organization-user');
  }

  ngOnInit(): void {
    const existingColumns = this.statePersistingService.get<GridColumn[]>(ORGANIZATION_USER_COLUMNS_ID);
    if (existingColumns) {
      this.store.dispatch(OrganizationUserActions.updateGridColumns(existingColumns));
    } else {
      this.store.dispatch(OrganizationUserActions.updateGridColumns(this.defaultGridColumns));
    }

    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.updateUnclickableColumns(this.defaultGridColumns);
    this.subscriptions.add(this.gridColumns$.subscribe((columns) => this.updateUnclickableColumns(columns)));
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(OrganizationUserActions.updateGridState(gridState));
  }

  override rowIdSelect(event: CellClickEvent) {
    super.rowIdSelect(event, this.router, this.route);
  }
}
