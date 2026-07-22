import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { createGridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { SystemIntegratorComponentStore } from './system-integrators.component-store';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { ShallowUser } from 'src/app/shared/models/userV2.model';
import { MatDialog } from '@angular/material/dialog';
import { AddSystemIntegratorDialogComponent } from './add-system-integrator-dialog/add-system-integrator-dialog.component';
import { GlobalAdminSystemIntegratorActions } from 'src/app/store/global-admin/system-integrators/actions';
import { Actions, ofType } from '@ngrx/effects';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { toUuid } from 'src/app/shared/models/has-uuid';
import { mapArray } from 'src/app/shared/helpers/observable-helpers';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { CollectionExtensionButtonComponent } from '../../../../shared/components/collection-extension-button/collection-extension-button.component';
import { AsyncPipe } from '@angular/common';
import { LocalGridComponent } from '../../../../shared/components/local-grid/local-grid.component';

@Component({
  selector: 'app-global-admin-system-integrators',
  templateUrl: './global-admin-system-integrators.component.html',
  styleUrl: './global-admin-system-integrators.component.scss',
  providers: [SystemIntegratorComponentStore],
  imports: [
    CardComponent,
    CardHeaderComponent,
    CollectionExtensionButtonComponent,
    LocalGridComponent,
    AsyncPipe
],
})
export class GlobalAdminSystemIntegratorsComponent extends BaseComponent implements OnInit {
  public readonly systemIntegrators$ = this.componentStore.systemIntegrators$;
  public readonly loading$ = this.componentStore.loading$;

  public readonly gridColumns: GridColumn[] = [
    {
      field: 'name',
      title: $localize`Navn`,
      hidden: false,
    },
    {
      field: 'email',
      title: $localize`Email`,
      hidden: false,
    },
    createGridActionColumn(['delete']),
  ];

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly componentStore: SystemIntegratorComponentStore,
    private readonly confirmActionService: ConfirmActionService,
    private readonly actions$: Actions,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(GlobalAdminSystemIntegratorActions.editSystemIntegratorSuccess)).subscribe(() => {
        this.componentStore.getSystemIntegrators();
      }),
    );

    this.componentStore.getSystemIntegrators();
  }

  public openAddSystemIntegratorDialog(): void {
    const dialogRef = this.dialog.open(AddSystemIntegratorDialogComponent);
    dialogRef.componentInstance.systemIntegratorUuids$ = this.componentStore.systemIntegrators$.pipe(mapArray(toUuid));
  }

  public deleteSystemIntegrator(systemIntegrator: ShallowUser): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil fjerne "${systemIntegrator.name}"'s rettighed som Systemintegrator?`,
      onConfirm: () =>
        this.store.dispatch(GlobalAdminSystemIntegratorActions.editSystemIntegrator(systemIntegrator.uuid, false)),
    });
  }
}
