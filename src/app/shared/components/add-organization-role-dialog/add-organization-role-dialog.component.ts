import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-organization-role-dialog',
  templateUrl: './add-organization-role-dialog.component.html',
  styleUrl: './add-organization-role-dialog.component.scss',
})
export class AddOrganizationRoleDialogComponent {
  public createForm = new FormGroup({
    role: new FormControl<string | undefined>(undefined, Validators.required),
    user: new FormControl<number | undefined>(undefined),
  });

  constructor(
    private dialogRef: MatDialogRef<AddOrganizationRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { unitName: string }
  ) {}

  public onCreate(): void {}

  public onCancel(): void {
    this.dialogRef.close();
  }
}
