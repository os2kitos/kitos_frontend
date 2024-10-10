import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { combineLatestWith, first } from 'rxjs/operators';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { GridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import {
  ORGANIZATION_USER_COLUMNS_ID,
  ORGANIZATION_USER_SECTION_NAME,
} from 'src/app/shared/persistent-state-constants';
import { StatePersistingService } from 'src/app/shared/services/state-persisting.service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import {
  selectOrganizationUserByIndex,
  selectOrganizationUserByUuid,
  selectOrganizationUserCreatePermissions,
  selectOrganizationUserDeletePermissions,
  selectOrganizationUserGridColumns,
  selectOrganizationUserGridData,
  selectOrganizationUserGridLoading,
  selectOrganizationUserGridState,
  selectOrganizationUserModifyPermissions,
} from 'src/app/store/organization/organization-user/selectors';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { UserInfoDialogComponent } from './user-info-dialog/user-info-dialog.component';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener-service.service';
import { OrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';

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
      title: $localize`Organisations roller`,
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
      width: 100,
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
      tooltipNegativeText: this.negativeTooltipText,
    },
    {
      field: 'Actions',
      title: ' ',
      section: this.organizationUserSectionName,
      hidden: false,
      style: 'action-buttons',
      isSticky: true,
      noFilter: true,
      extraData: [{ type: 'edit' }, { type: 'delete' }] as GridActionColumn[],
      width: 100,
    },
  ];

  constructor(
    store: Store,
    private statePersistingService: StatePersistingService,
    private actions$: Actions,
    private dialog: MatDialog,
    private dialogOpenerService: DialogOpenerService
  ) {
    super(store, 'organization-user');
  }

  ngOnInit(): void {
    this.store.dispatch(OrganizationUserActions.getOrganizationUserPermissions());
    const existingColumns = this.statePersistingService.get<GridColumn[]>(ORGANIZATION_USER_COLUMNS_ID);
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
          this.stateChange(gridState);
        })
    );
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(OrganizationUserActions.updateGridState(gridState));
  }

  public openCreateDialog() {
    this.dialog.open(CreateUserDialogComponent, { height: '95%', maxHeight: '750px' });
  }

  public onEditUser(user: OrganizationUser): void {
    this.dialogOpenerService.openEditUserDialog(user, false);
  }

  public onDeleteUser(user: OrganizationUser): void {
    const user$ = this.store.select(selectOrganizationUserByUuid(user.Uuid)).pipe(filterNullish());
    this.dialogOpenerService.openDeleteUserDialog(user$, false);
  }

  override rowIdSelect(event: CellClickEvent) {
    if (this.cellIsClickableStyle(event)) {
      this.openUserInfoDialog(event.rowIndex);
    }
  }

  private updateDefaultColumns(): void {
    this.store.dispatch(OrganizationUserActions.updateGridColumns(this.defaultGridColumns));
  }

  private openUserInfoDialog(index: number) {
    const user$ = this.store.select(selectOrganizationUserByIndex(index));
    const dialogRef = this.dialog.open(UserInfoDialogComponent, { minWidth: '800px', width: '25%' });
    dialogRef.componentInstance.user$ = user$;
    dialogRef.componentInstance.hasModificationPermission$ = this.hasModificationPermission$;
  }
}
