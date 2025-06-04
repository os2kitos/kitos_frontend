import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { GlobalAdminActions } from 'src/app/store/global-admin/actions';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { Actions, ofType } from '@ngrx/effects';
import { selectAllGlobalAdmins, selectGlobalAdminsLoading } from 'src/app/store/global-admin/selectors';
import { map } from 'rxjs';
import { ShallowUser } from 'src/app/shared/models/userV2.model';
import { DialogComponent } from '../../../../shared/components/dialogs/dialog/dialog.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { UserDropdownComponent } from '../../../../shared/components/dropdowns/user-dropdown/user-dropdown.component';
import { DialogActionsComponent } from '../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-create-global-admin-dialog',
  templateUrl: './create-global-admin-dialog.component.html',
  styleUrl: './create-global-admin-dialog.component.scss',
  imports: [
    DialogComponent,
    NgIf,
    LoadingComponent,
    UserDropdownComponent,
    FormsModule,
    ReactiveFormsModule,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class CreateGlobalAdminDialogComponent extends BaseComponent implements OnInit {
  public formGroup = new FormGroup({
    user: new FormControl<ShallowUser | undefined>(undefined, Validators.required),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateGlobalAdminDialogComponent>,
    private store: Store,
    private actions$: Actions,
  ) {
    super();
  }

  public readonly globalAdminsLoading$ = this.store.select(selectGlobalAdminsLoading);
  public readonly globalAdminUuids$ = this.store
    .select(selectAllGlobalAdmins)
    .pipe(map((globalAdmins) => globalAdmins.map((globalAdmin) => globalAdmin.uuid)));

  public ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(GlobalAdminActions.addGlobalAdminSuccess)).subscribe(() => this.close()),
    );
  }

  public close(): void {
    this.dialogRef.close();
  }

  public addGlobalAdmin(): void {
    const selectedUser = this.formGroup.value.user;
    if (!selectedUser) throw new Error('No user selected');
    this.store.dispatch(GlobalAdminActions.addGlobalAdmin(selectedUser.uuid));
  }
}
