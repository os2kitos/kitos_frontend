import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { CreateLocalAdminDialogComponent } from '../create-local-admin-dialog/create-local-admin-dialog.component';
import { Store } from '@ngrx/store';
import { selectAllLocalAdmins, selectLocalAdminsLoading } from 'src/app/store/global-admin/local-admins/selectors';
import { LocalAdminUser } from 'src/app/shared/models/local-admin/local-admin-user.model';
import { LocalAdminUserActions } from 'src/app/store/global-admin/local-admins/actions';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { GridExportActions } from 'src/app/store/grid/actions';

@Component({
  selector: 'app-global-admin-local-admins-grid',
  templateUrl: './global-admin-local-admins-grid.component.html',
  styleUrl: './global-admin-local-admins-grid.component.scss',
})
export class GlobalAdminLocalAdminsGridComponent {
  public readonly localAdmins$ = this.store.select(selectAllLocalAdmins);
  public readonly isLoading$ = this.store.select(selectLocalAdminsLoading);

  constructor(private dialog: MatDialog, private store: Store, private confirmActionService: ConfirmActionService) {}

  public readonly gridColumns: GridColumn[] = [
    {
      field: 'organization.name',
      title: $localize`Organisation`,
      hidden: false,
    },
    {
      field: 'user.name',
      title: $localize`Navn`,
      hidden: false,
    },
    {
      field: 'user.email',
      title: $localize`Email`,
      hidden: false,
    },
    {
      field: 'Actions',
      title: ' ',
      hidden: false,
      style: 'action-buttons',
      isSticky: true,
      noFilter: true,
      extraData: [{ type: 'delete' }] as GridActionColumn[],
      width: 50,
    },
  ];

  public createLocalAdmin(): void {
    this.dialog.open(CreateLocalAdminDialogComponent);
  }

  public deleteLocalAdmin(localAdmin: LocalAdminUser): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      title: $localize`Slet lokal administrator`,
      message: $localize`Er du sikker på at du vil slette "${localAdmin.user.name}" som lokal administrator for organisationen "${localAdmin.organization.name}"?`,
      onConfirm: () =>
        this.store.dispatch(LocalAdminUserActions.removeLocalAdmin(localAdmin.organization.uuid, localAdmin.user.uuid)),
    });
  }

  public exportToExcel() {
    this.store.dispatch(GridExportActions.exportLocalData());
  }
}
