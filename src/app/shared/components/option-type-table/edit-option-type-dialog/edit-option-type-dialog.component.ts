import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { OptionTypeService } from 'src/app/shared/services/option-type.service';
import { OptionTypeTableItem, OptionTypeTableOption } from '../option-type-table.component';

@Component({
  selector: 'app-edit-option-type-dialog',
  templateUrl: './edit-option-type-dialog.component.html',
  styleUrl: './edit-option-type-dialog.component.scss',
})
export class EditOptionTypeDialogComponent implements OnInit {
  @Input() optionTypeItem!: OptionTypeTableItem;
  @Input() optionType!: OptionTypeTableOption;

  public form = new FormGroup({
    description: new FormControl<string>(''),
  });

  constructor(
    private dialogRef: MatDialogRef<EditOptionTypeDialogComponent>,
    private optionTypeService: OptionTypeService
  ) {}

  public ngOnInit(): void {
    this.form.patchValue({
      description: this.optionTypeItem.description,
    });
  }

  public onSave(): void {
    const newDescription = this.form.value.description ?? undefined;
    const newChoiceTypeItem: OptionTypeTableItem = { ...this.optionTypeItem, description: newDescription };
    this.optionTypeService.updateOptionType(newChoiceTypeItem, this.optionType);
    this.dialogRef.close();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public disableSaveButton(): boolean {
    return !this.form.valid || this.form.value.description === this.optionTypeItem.description;
  }
}
