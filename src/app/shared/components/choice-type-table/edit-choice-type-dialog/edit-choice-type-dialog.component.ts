import { Component, Input, OnInit } from '@angular/core';
import { ChoiceTypeTableItem, ChoiceTypeTableOption } from '../choice-type-table.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { ChoiceTypeService } from 'src/app/shared/services/choice-type.service';

@Component({
  selector: 'app-edit-choice-type-dialog',
  templateUrl: './edit-choice-type-dialog.component.html',
  styleUrl: './edit-choice-type-dialog.component.scss',
})
export class EditChoiceTypeDialogComponent implements OnInit {
  @Input() choiceTypeItem!: ChoiceTypeTableItem;
  @Input() type!: ChoiceTypeTableOption;

  public form = new FormGroup({
    description: new FormControl<string>(''),
  });

  constructor(
    private dialogRef: MatDialogRef<EditChoiceTypeDialogComponent>,
    private choiceTypeService: ChoiceTypeService
  ) {}

  public ngOnInit(): void {
    this.form.patchValue({
      description: this.choiceTypeItem.description,
    });
  }

  public onSave(): void {
    const newDescription = this.form.value.description ?? undefined;
    const newChoiceTypeItem: ChoiceTypeTableItem = { ...this.choiceTypeItem, description: newDescription };
    this.choiceTypeService.updateChoiceType(newChoiceTypeItem, this.type);
    this.dialogRef.close();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public disableSaveButton(): boolean {
    return !this.form.valid || this.form.value.description === this.choiceTypeItem.description;
  }
}
