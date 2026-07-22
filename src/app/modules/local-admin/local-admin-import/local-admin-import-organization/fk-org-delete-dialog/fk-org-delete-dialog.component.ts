import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { FkOrgActions } from 'src/app/store/local-admin/fk-org/actions';
import { selectIsDeleteLoading } from 'src/app/store/local-admin/fk-org/selectors';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import { DialogComponent } from '../../../../../shared/components/dialogs/dialog/dialog.component';
import { AsyncPipe } from '@angular/common';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { DialogActionsComponent } from '../../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-fk-org-delete-dialog',
  templateUrl: './fk-org-delete-dialog.component.html',
  styleUrl: './fk-org-delete-dialog.component.scss',
  imports: [
    DialogComponent,
    StandardVerticalContentGridComponent,
    ParagraphComponent,
    LoadingComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe
],
})
export class FkOrgDeleteDialogComponent extends BaseComponent implements OnInit {
  public readonly isDeleteLoading$ = this.store.select(selectIsDeleteLoading);

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly dialog: MatDialogRef<FkOrgDeleteDialogComponent>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(FkOrgActions.deleteConnectionSuccess)).subscribe(() => {
        this.store.dispatch(OrganizationUnitActions.getOrganizationUnits());
        this.cancel();
      }),
    );
  }

  public deleteConnection(purgeUnusedExternalUnits: boolean) {
    this.store.dispatch(FkOrgActions.deleteConnection(purgeUnusedExternalUnits));
  }

  public cancel() {
    this.dialog.close(false);
  }
}
