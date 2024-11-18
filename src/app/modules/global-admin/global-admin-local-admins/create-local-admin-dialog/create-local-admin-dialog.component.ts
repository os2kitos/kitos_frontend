import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { APIOrganizationResponseDTO, APIUserReferenceResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { LocalAdminUserActions } from 'src/app/store/global-admin/local-admins/actions';
import { selectLocalAdminsLoading } from 'src/app/store/global-admin/local-admins/selectors';

@Component({
  selector: 'app-create-local-admin-dialog',
  templateUrl: './create-local-admin-dialog.component.html',
  styleUrl: './create-local-admin-dialog.component.scss',
})
export class CreateLocalAdminDialogComponent extends BaseComponent implements OnInit {
  public formGroup: FormGroup = new FormGroup({
    user: new FormControl<APIUserReferenceResponseDTO | undefined>(undefined, Validators.required),
    organization: new FormControl<APIOrganizationResponseDTO | undefined>(undefined, Validators.required),
  });

  public readonly loading$ = this.store.select(selectLocalAdminsLoading);

  constructor(
    private dialogRef: MatDialogRef<CreateLocalAdminDialogComponent>,
    private store: Store,
    private actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(LocalAdminUserActions.addLocalAdminSuccess)).subscribe(() => {
        this.close();
      })
    );
  }

  public close(): void {
    this.dialogRef.close();
  }

  public addLocalAdmin(): void {
    const formValue = this.formGroup.value;
    const userUuid = formValue.user.uuid;
    const organizationUuid = formValue.organization.uuid;
    this.store.dispatch(LocalAdminUserActions.addLocalAdmin(organizationUuid, userUuid));
  }
}
