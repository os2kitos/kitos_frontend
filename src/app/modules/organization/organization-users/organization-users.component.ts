import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, first } from 'rxjs/operators';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import {
  ORGANIZATION_USER_COLUMNS_ID,
  ORGANIZATION_USER_SECTION_NAME,
} from 'src/app/shared/constants/persistent-state-constants';
import { createGridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { ODataOrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';
import { GridColumnStorageService } from 'src/app/shared/services/grid-column-storage-service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import {
  selectOrganizationUserByUuid,
  selectOrganizationUserCreatePermissions,
  selectOrganizationUserDeletePermissions,
  selectOrganizationUserGridColumns,
  selectOrganizationUserGridData,
  selectOrganizationUserGridLoading,
  selectOrganizationUserGridState,
  selectOrganizationUserModifyPermissions,
} from 'src/app/store/organization/organization-user/selectors';
import { ExportMenuButtonComponent } from '../../../shared/components/buttons/export-menu-button/export-menu-button.component';
import { CreateEntityButtonComponent } from '../../../shared/components/entity-creation/create-entity-button/create-entity-button.component';
import { GridOptionsButtonComponent } from '../../../shared/components/grid-options-button/grid-options-button.component';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { HideShowButtonComponent } from '../../../shared/components/grid/hide-show-button/hide-show-button.component';
import { OverviewHeaderComponent } from '../../../shared/components/overview-header/overview-header.component';
import { UserInfoDialogComponent } from './user-info-dialog/user-info-dialog.component';

@Component({
  selector: 'app-organization-users',
  templateUrl: './organization-users.component.html',
  styleUrl: './organization-users.component.scss',
  imports: [
    OverviewHeaderComponent,
    NgIf,
    GridOptionsButtonComponent,
    ExportMenuButtonComponent,
    HideShowButtonComponent,
    CreateEntityButtonComponent,
    GridComponent,
    AsyncPipe,
  ],
})
export class OrganizationUsersComponent extends BaseOverviewComponent implements OnInit {
  public readonly isLoading$ = this.store.select(selectOrganizationUserGridLoading);
  public readonly gridData$ = this.store.select(selectOrganizationUserGridData);
  public readonly gridState$ = this.store.select(selectOrganizationUserGridState);
  public readonly gridColumns$ = this.store.select(selectOrganizationUserGridColumns);
  public readonly hasCreatePermission$ = this.store.select(selectOrganizationUserCreatePermissions);

  public readonly hasModificationPermission$ = this.store.select(selectOrganizationUserModifyPermissions);
  public readonly hasDeletePermission$ = this.store.select(selectOrganizationUserDeletePermissions);

  private readonly organizationUserSectionName = ORGANIZATION_USER_SECTION_NAME;

  private readonly negativeTooltipText = $localize`Ingen rettighed tilføjet`;
  public readonly defaultGridColumns: GridColumn[] = [
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
      hidden: false,
      width: 350,
    },
    {
      field: 'ObjectOwner.Name',
      title: $localize`Oprettet af: Bruger`,
      section: this.organizationUserSectionName,
      hidden: false,
      width: 350,
    },
    {
      field: 'Roles',
      title: $localize`Organisations roller`,
      section: this.organizationUserSectionName,
      hidden: true,
      noFilter: true,
      sortable: false,
    },
    {
      field: 'HasApiAccess',
      title: $localize`API bruger`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
      width: 100,
      sortable: false,
      tooltipNegativeText: this.negativeTooltipText,
    },
    {
      field: 'IsLocalAdmin',
      title: $localize`Lokal Admin`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
      width: 120,
      sortable: false,
      tooltipPositiveText: $localize`Øverste myndighed. SKRIV rettighed til alle moduler, brugerhåndtering, samt adgang til lokal administrator indstillinger`,
      tooltipNegativeText: this.negativeTooltipText,
    },
    {
      field: 'IsOrganizationModuleAdmin',
      title: $localize`Organisations Admin`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
      width: 170,
      sortable: false,
      tooltipPositiveText: $localize`SKRIV rettighed til Organisations modul, mulighed for at oprette/redigere brugere`,
      tooltipNegativeText: this.negativeTooltipText,
    },
    {
      field: 'IsSystemModuleAdmin',
      title: $localize`System Admin`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
      width: 125,
      sortable: false,
      tooltipPositiveText: $localize`SKRIV rettighed til System modul`,
      tooltipNegativeText: this.negativeTooltipText,
    },
    {
      field: 'IsContractModuleAdmin',
      title: $localize`Kontrakt Admin`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
      width: 130,
      sortable: false,
      tooltipPositiveText: $localize`SKRIV rettighed til Kontrakt og Databehandling modul`,
      tooltipNegativeText: this.negativeTooltipText,
    },
    {
      field: 'HasRightsHolderAccess',
      title: $localize`Rettighedshaveradgang`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
      width: 190,
      sortable: false,
      tooltipNegativeText: this.negativeTooltipText,
    },
    {
      field: 'HasStakeHolderAccess',
      title: $localize`Interessentadgang`,
      section: this.organizationUserSectionName,
      hidden: false,
      noFilter: true,
      style: 'boolean',
      width: 160,
      sortable: false,
      tooltipNegativeText: this.negativeTooltipText,
    },
    createGridActionColumn(['edit', 'delete']),
  ];

  constructor(
    store: Store,
    private gridColumnStorageService: GridColumnStorageService,
    private actions$: Actions,
    private dialog: MatDialog,
    private dialogOpenerService: DialogOpenerService
  ) {
    super(store, 'organization-user');
  }

  ngOnInit(): void {
    this.store.dispatch(OrganizationUserActions.getOrganizationUserPermissions());
    const existingColumns = this.gridColumnStorageService.getColumns(
      ORGANIZATION_USER_COLUMNS_ID,
      this.defaultGridColumns
    );
    if (existingColumns) {
      this.store.dispatch(OrganizationUserActions.updateGridColumns(existingColumns));
    } else {
      this.updateDefaultColumns();
    }

    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.updateUnclickableColumns(this.defaultGridColumns);
    this.subscriptions.add(this.gridColumns$.subscribe((columns) => this.updateUnclickableColumns(columns)));
    this.subscriptions.add(
      this.actions$
        .pipe(ofType(OrganizationUserActions.resetGridConfiguration))
        .subscribe(() => this.updateDefaultColumns())
    );

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            OrganizationUserActions.createUserSuccess,
            OrganizationUserActions.updateUserSuccess,
            OrganizationUserActions.deleteUserSuccess,
            OrganizationUserActions.copyRolesSuccess,
            OrganizationUserActions.transferRolesSuccess
          ),
          combineLatestWith(this.gridState$)
        )
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState, true);
        })
    );
  }

  public stateChange(gridState: GridState, forceUpdate = false): void {
    this.store.dispatch(OrganizationUserActions.updateGridState(gridState, forceUpdate));
  }

  public onEditUser(user: ODataOrganizationUser): void {
    this.dialogOpenerService.openEditUserDialog(user, false);
  }

  public onDeleteUser(user: ODataOrganizationUser): void {
    const user$ = this.store.select(selectOrganizationUserByUuid(user.Uuid)).pipe(filterNullish());
    this.dialogOpenerService.openDeleteUserDialog(user$, false);
  }

  override rowIdSelect(event: CellClickEvent) {
    if (this.cellIsClickableStyle(event)) {
      this.openUserInfoDialog(event.dataItem.Uuid);
    }
  }

  private updateDefaultColumns(): void {
    const columns = this.mapColumnOrder(this.defaultGridColumns);
    this.store.dispatch(OrganizationUserActions.updateGridColumns(columns));
  }

  private openUserInfoDialog(uuid: string): void {
    const user$ = this.store.select(selectOrganizationUserByUuid(uuid)).pipe(filterNullish());
    const dialogRef = this.dialog.open(UserInfoDialogComponent, { minWidth: '800px', width: '25%' });
    dialogRef.componentInstance.user$ = user$;
    dialogRef.componentInstance.hasModificationPermission$ = this.hasModificationPermission$;
  }
}
