import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first, of } from 'rxjs';
import { BaseOverviewComponent } from 'src/app/shared/base/base-overview.component';
import { ORGANIZATION_SECTION_NAME } from 'src/app/shared/constants/persistent-state-constants';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { GridState } from 'src/app/shared/models/grid-state.model';
import { BooleanChange } from 'src/app/shared/models/grid/grid-events.model';
import {
  OrganizationOData,
  organizationTypeOptions,
} from 'src/app/shared/models/organization/organization-odata.model';
import { RegistrationEntityTypes } from 'src/app/shared/models/registrations/registration-entity-categories.model';
import { yesNoBooleanOptions } from 'src/app/shared/models/yes-no-boolean-options.model';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { OrganizationActions } from 'src/app/store/organization/actions';
import {
  selectOrganizationGridData,
  selectOrganizationGridLoading,
  selectOrganizationGridState,
} from 'src/app/store/organization/selectors';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { ExportMenuButtonComponent } from '../../../../shared/components/buttons/export-menu-button/export-menu-button.component';
import { GridOptionsButtonComponent } from '../../../../shared/components/grid-options-button/grid-options-button.component';
import { GridComponent } from '../../../../shared/components/grid/grid.component';
import { OverviewHeaderComponent } from '../../../../shared/components/overview-header/overview-header.component';
import { CreateOrganizationDialogComponent } from '../organizations-dialogs/create-organization-dialog/create-organization-dialog.component';
import { DeleteOrganizationDialogComponent } from '../organizations-dialogs/delete-organization-dialog/delete-organization-dialog.component';
import { EditOrganizationDialogComponent } from '../organizations-dialogs/edit-organization-dialog/edit-organization-dialog.component';

@Component({
  selector: 'app-global-admin-organizations-grid',
  templateUrl: './global-admin-organizations-grid.component.html',
  styleUrl: './global-admin-organizations-grid.component.scss',
  imports: [
    OverviewHeaderComponent,
    GridOptionsButtonComponent,
    ExportMenuButtonComponent,
    ButtonComponent,
    GridComponent,
    AsyncPipe,
  ],
})
export class GlobalAdminOrganizationsGridComponent extends BaseOverviewComponent implements OnInit {
  private readonly sectionName: string = ORGANIZATION_SECTION_NAME;
  public readonly disabledSupplierFieldTooltip = $localize`Kun organisationer af typen "Virksomhed" kan være ISMS leverandører.`;

  public readonly globalAdminEntityType: RegistrationEntityTypes = 'global-admin-organization';
  public readonly isLoading$ = this.store.select(selectOrganizationGridLoading);
  public readonly gridData$ = this.store.select(selectOrganizationGridData);
  public readonly gridState$ = this.store.select(selectOrganizationGridState);
  private readonly yesNoOptions = yesNoBooleanOptions;
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
      width: 200,
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
    {
      field: 'IsSupplier',
      title: $localize`ISMS leverandør`,
      section: this.sectionName,
      hidden: false,
      style: 'boolean',
      filter: 'boolean',
      extraData: this.yesNoOptions,
      width: 150,
    },
    {
      field: 'Disabled',
      title: $localize`Deaktiveret`,
      section: this.sectionName,
      hidden: false,
      style: 'boolean',
      filter: 'boolean',
      extraData: this.yesNoOptions,
      width: 150,
    },
    {
      field: 'Actions',
      title: ' ',
      hidden: false,
      style: 'action-buttons',
      sortable: false,
      isSticky: true,
      noFilter: true,
      extraData: [
        { type: 'edit', visibilityColumn: 'Actions' },
        { type: 'toggle' },
        { type: 'delete', visibilityColumn: 'Disabled' },
      ],
      width: 150,
    },
  ];

  public readonly gridColumns$ = of(this.gridColumns);

  constructor(
    store: Store,
    private dialog: MatDialog,
    private actions$: Actions,
    private readonly confirmationService: ConfirmActionService,
  ) {
    super(store, 'global-admin-organization');
  }
  ngOnInit() {
    this.gridState$.pipe(first()).subscribe((gridState) => this.stateChange(gridState));

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            OrganizationActions.createOrganizationSuccess,
            OrganizationActions.patchOrganizationSuccess,
            OrganizationActions.deleteOrganizationSuccess,
            OrganizationActions.changeOrganizationDisabledStatusSuccess,
          ),
          combineLatestWith(this.gridState$),
        )
        .subscribe(([_, gridState]) => {
          this.stateChange(gridState);
        }),
    );
  }

  public stateChange(gridState: GridState) {
    this.store.dispatch(OrganizationActions.updateGridState(gridState));
  }

  public onEditOrganization(organization: OrganizationOData) {
    const dialogRef = this.dialog.open(EditOrganizationDialogComponent);
    const componentInstance = dialogRef.componentInstance;
    componentInstance.organization = organization;
    componentInstance.tooltipText = this.disabledSupplierFieldTooltip;
  }

  public onDeleteOrganization(organization: OrganizationOData) {
    const dialogRef = this.dialog.open(DeleteOrganizationDialogComponent, {
      width: 'auto',
      minWidth: '400px',
      maxWidth: '1200px',
      height: 'auto',
    });
    dialogRef.componentInstance.organization = organization;
  }

  public onDisableOrganization(changeRequest: BooleanChange<OrganizationOData>) {
    const messageActionText = changeRequest.value ? $localize`aktivere` : $localize`deaktivere`;
    this.confirmationService.confirmAction({
      title: changeRequest.value ? $localize`Aktiver organisation` : $localize`Deaktiver organisation`,
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på, at du vil ${messageActionText} organisationen "${changeRequest.item.Name}"?`,
      onConfirm: () => {
        //16.10.2025: Reverse the value, for display reasons the toggle needs to be reversed to display the correct icon
        const updateValue = !changeRequest.value;
        this.store.dispatch(OrganizationActions.changeOrganizationDisabledStatus(changeRequest.item.Uuid, updateValue));
      },
    });
  }

  public onCreateOrganization() {
    const dialogRef = this.dialog.open(CreateOrganizationDialogComponent);
    dialogRef.componentInstance.tooltipText = this.disabledSupplierFieldTooltip;
  }
}
