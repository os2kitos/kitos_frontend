import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ShallowUser } from 'src/app/shared/models/userV2.model';
import { GlobalAdminSystemIntegratorActions } from 'src/app/store/global-admin/system-integrators/actions';
import { DialogComponent } from '../../../../../shared/components/dialogs/dialog/dialog.component';
import { UserDropdownComponent } from '../../../../../shared/components/dropdowns/user-dropdown/user-dropdown.component';
import { DialogActionsComponent } from '../../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-add-system-integrator-dialog',
  templateUrl: './add-system-integrator-dialog.component.html',
  styleUrl: './add-system-integrator-dialog.component.scss',
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    UserDropdownComponent,
    DialogActionsComponent,
    ButtonComponent,
  ],
})
export class AddSystemIntegratorDialogComponent {
  @Input() systemIntegratorUuids$!: Observable<string[]>;

  public readonly formGroup = new FormGroup({
    user: new FormControl<ShallowUser | undefined>(undefined, Validators.required),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<AddSystemIntegratorDialogComponent>,
    private readonly store: Store,
  ) {}

  public addSystemIntegrator(): void {
    const selectedUser = this.formGroup.value.user;
    if (!selectedUser) throw new Error('No user selected');
    this.store.dispatch(GlobalAdminSystemIntegratorActions.editSystemIntegrator(selectedUser.uuid, true));
    this.closeDialog();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
