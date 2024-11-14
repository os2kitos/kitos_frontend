import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CreateGlobalAdminComponentStore } from './create-global-admin.component-store';
import { APIUserReferenceResponseDTO } from 'src/app/api/v2';
import { GlobalAdminActions } from 'src/app/store/global-admin/actions';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { Actions, ofType } from '@ngrx/effects';
import { selectGlobalAdminsLoading } from 'src/app/store/global-admin/selectors';

@Component({
  selector: 'app-create-global-admin-dialog',
  templateUrl: './create-global-admin-dialog.component.html',
  styleUrl: './create-global-admin-dialog.component.scss',
  providers: [CreateGlobalAdminComponentStore],
})
export class CreateGlobalAdminDialogComponent extends BaseComponent implements OnInit {
  public formGroup = new FormGroup({
    user: new FormControl<APIUserReferenceResponseDTO | undefined>(undefined, Validators.required),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateGlobalAdminDialogComponent>,
    private store: Store,
    private componentStore: CreateGlobalAdminComponentStore,
    private actions$: Actions
  ) {
    super();
  }

  public readonly users$ = this.componentStore.users$;
  public readonly usersLoading$ = this.componentStore.loading$;

  public readonly globalAdminsLoading$ = this.store.select(selectGlobalAdminsLoading);

  public ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(GlobalAdminActions.addGlobalAdminSuccess)).subscribe(() => this.close())
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

  public searchUsers(search: string): void {
    this.componentStore.searchUsers(search);
  }
}
