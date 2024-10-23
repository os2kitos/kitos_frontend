import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';

@Component({
  selector: 'app-fk-org-delete-dialog',
  templateUrl: './fk-org-delete-dialog.component.html',
  styleUrl: './fk-org-delete-dialog.component.scss',
})
export class FkOrgDeleteDialogComponent extends BaseComponent {
  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly dialog: MatDialogRef<FkOrgDeleteDialogComponent>
  ) {
    super();
  }

  public OkResult() {
    this.dialog.close(true);
  }

  public CancelResult() {
    this.dialog.close(false);
  }
}
