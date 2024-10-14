import { Component, Input, OnInit } from '@angular/core';
import { ChoiceTypeTableItem } from '../choice-type-table.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-choice-type-dialog',
  templateUrl: './edit-choice-type-dialog.component.html',
  styleUrl: './edit-choice-type-dialog.component.scss',
})
export class EditChoiceTypeDialogComponent implements OnInit {
  @Input() choiceTypeItem!: ChoiceTypeTableItem;

  public form = new FormGroup({
    description: new FormControl<string>(''),
  });

  constructor(private dialogRef: MatDialogRef<EditChoiceTypeDialogComponent>) {}

  public ngOnInit(): void {
    this.form.patchValue({
      description: this.choiceTypeItem.description,
    });
  }

  public onSave(): void {}

  public onCancel(): void {
    this.dialogRef.close();
  }

  public disableSaveButton(): boolean {
    return !this.form.valid || this.form.value.description === this.choiceTypeItem.description;
  }
}
