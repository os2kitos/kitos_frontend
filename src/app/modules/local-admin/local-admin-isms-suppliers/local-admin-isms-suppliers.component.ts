import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ButtonComponent } from 'src/app/shared/components/buttons/button/button.component';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DropdownDialogComponent } from 'src/app/shared/components/dialogs/dropdown-dialog/dropdown-dialog.component';
import { LocalGridComponent } from 'src/app/shared/components/local-grid/local-grid.component';
import { OverviewHeaderComponent } from 'src/app/shared/components/overview-header/overview-header.component';
import { createGridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { ShallowOrganization } from 'src/app/shared/models/organization/shallow-organization.model';
import { resetOrganizationStateAction } from 'src/app/store/meta/actions';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { OrganizationSuppliersActions } from 'src/app/store/organization/organization-suppliers/actions';
import {
  selectAvailableOrganizationSuppliers,
  selectOrganizationSuppliers,
  selectOrganizationSuppliersLoading,
} from 'src/app/store/organization/organization-suppliers/selectors';
import { selectOrganizationHasModifyPermission } from 'src/app/store/organization/selectors';

@Component({
  selector: 'app-local-admin-isms-suppliers',
  imports: [CardComponent, LocalGridComponent, AsyncPipe, OverviewHeaderComponent, ButtonComponent],
  templateUrl: './local-admin-isms-suppliers.component.html',
  styleUrl: './local-admin-isms-suppliers.component.scss',
})
export class LocalAdminIsmsSuppliersComponent extends BaseComponent implements OnInit {
  constructor(
    private store: Store,
    private dialog: MatDialog,
    private actions$: Actions,
  ) {
    super();
  }

  ngOnInit(): void {
    this.refreshData();

    this.subscriptions.add(
      this.actions$.pipe(ofType(resetOrganizationStateAction)).subscribe(() => {
        this.refreshData();
      }),
    );
  }

  public gridColumns = [
    { title: $localize`Virksomhed`, field: 'name', hidden: false },
    { title: $localize`CVR`, field: 'cvr', hidden: false },
    createGridActionColumn(['delete']),
  ];

  public canModifyOrganization$ = this.store.select(selectOrganizationHasModifyPermission);
  public suppliersLoading$ = this.store.select(selectOrganizationSuppliersLoading);
  public suppliers$ = this.store.select(selectOrganizationSuppliers);
  public availableSuppliers$ = this.store.select(selectAvailableOrganizationSuppliers);

  public openAddSupplierDialog() {
    const dialogRef = this.dialog.open(DropdownDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.title = $localize`Tilføj leverandør`;
    dialogInstance.description = $localize`Når kommunen har en eller flere leverandører tilknyttet, deaktiveres redigering af følgende felter i Kitos:`;
    dialogInstance.bulletPoints = [
      $localize`Databehandling - Tilsyn - Gennemførte og kommende tilsyn`,
      $localize`IT Systemer - Systemforside - Indeholder AI-teknologi?`,
      $localize`IT Systemer - Systemforside - Kritikalitet`,
      $localize`IT Systemer - GDPR - Hvad viste den seneste risikovurdering?`,
    ];
    dialogInstance.data$ = this.availableSuppliers$;
    dialogInstance.valueField = 'uuid';
    dialogInstance.textField = 'name';
    dialogInstance.dropdownText = $localize`Vælg leverandør`;
    dialogInstance.onOpen = () => this.onOpenAddDialog();
    dialogInstance.save.subscribe(($event: any) => {
      this.saveSupplier($event);
    });
  }

  public saveSupplier($event: ShallowOrganization) {
    this.store.dispatch(OrganizationSuppliersActions.addOrganizationSupplier($event.uuid));
    this.dialog.closeAll();
  }

  public onOpenAddDialog() {
    this.store.dispatch(OrganizationSuppliersActions.getAvailableOrganizationSuppliers());
  }

  private refreshData(): void {
    this.store.dispatch(OrganizationSuppliersActions.getOrganizationSuppliers());
    this.store.dispatch(OrganizationActions.getOrganizationPermissions());
  }

  public removeSupplier($event: ShallowOrganization) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.bodyText = $localize`Er du sikker på, at du vil fjerne ISMS leverandøren "${$event.name}"?`;
    dialogInstance.confirmColor = 'warn';

    this.subscriptions.add(
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((remove) => {
          if (remove) {
            this.store.dispatch(OrganizationSuppliersActions.removeOrganizationSupplier($event.uuid));
          }
        }),
    );
  }
}
