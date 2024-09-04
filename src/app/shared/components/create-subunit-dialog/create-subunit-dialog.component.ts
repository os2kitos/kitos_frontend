import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';

@Component({
  selector: 'app-create-subunit-dialog',
  templateUrl: './create-subunit-dialog.component.html',
  styleUrl: './create-subunit-dialog.component.scss',
})
export class CreateSubunitDialogComponent {
  public readonly parentUnitName = this.data.parentUnitName;

  public createForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
    ean: new FormControl<number | undefined>(undefined),
    id: new FormControl<number | undefined>(undefined),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateSubunitDialogComponent>,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { parentUnitUuid: string; parentUnitName: string },
    private store: Store
  ) {}

  public createSubunit(): void {
    const name = this.createForm.controls.name.value;
    const ean = this.createForm.controls.ean.value;
    const id = this.createForm.controls.id.value;
    if (!name) return; //TODO: This fails silently atm
    if (ean === null || id === null) return; //TODO: This check satisfies the type checker for now, should probably be handled better
    this.store.dispatch(
      OrganizationUnitActions.createOrganizationSubunit({ parentUnitUuid: this.data.parentUnitUuid, name, ean, id })
    );
  }

  public onCreate(): void {
    this.createSubunit();
    const newSubunitName = this.createForm.controls.name.value;
    this.notificationService.showDefault(`${newSubunitName} ` + $localize`er gemt`);
    this.dialogRef.close();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
