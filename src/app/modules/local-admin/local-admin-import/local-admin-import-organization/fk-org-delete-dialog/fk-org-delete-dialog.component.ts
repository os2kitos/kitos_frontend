import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { FkOrgActions } from 'src/app/store/local-admin/fk-org/actions';
import { selectIsDeleteLoading } from 'src/app/store/local-admin/fk-org/selectors';

@Component({
  selector: 'app-fk-org-delete-dialog',
  templateUrl: './fk-org-delete-dialog.component.html',
  styleUrl: './fk-org-delete-dialog.component.scss',
})
export class FkOrgDeleteDialogComponent extends BaseComponent implements OnInit {
  public readonly isDeleteLoading$ = this.store.select(selectIsDeleteLoading);

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly dialog: MatDialogRef<FkOrgDeleteDialogComponent>
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(FkOrgActions.deleteConnectionSuccess)).subscribe(() => {
        this.cancel();
      })
    );
  }

  public deleteConnection(purgeUnusedExternalUnits: boolean) {
    this.store.dispatch(FkOrgActions.deleteConnection(purgeUnusedExternalUnits));
  }

  public cancel() {
    this.dialog.close(false);
  }
}
