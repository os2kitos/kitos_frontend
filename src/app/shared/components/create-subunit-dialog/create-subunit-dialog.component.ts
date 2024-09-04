import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-subunit-dialog',
  templateUrl: './create-subunit-dialog.component.html',
  styleUrl: './create-subunit-dialog.component.scss',
})
export class CreateSubunitDialogComponent {

  constructor(private dialogRef: MatDialogRef<CreateSubunitDialogComponent>) { }

  public createSubunit(): void {
    // create subunit logic
  }

  public onCancel(): void {
    console.log('Cancel');
    this.dialogRef.close();
  }
}
