import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { OptionTypeTableItem, OptionTypeTableOption } from 'src/app/shared/models/options/local-option-type.model';
import { LocalOptionTypeService } from 'src/app/shared/services/local-option-type.service';

@Component({
  selector: 'app-edit-option-type-dialog',
  templateUrl: './edit-option-type-dialog.component.html',
  styleUrl: './edit-option-type-dialog.component.scss',
})
export class EditOptionTypeDialogComponent implements OnInit {
  @Input() optionTypeItem!: OptionTypeTableItem;
  @Input() optionType!: OptionTypeTableOption;

  public form = new FormGroup({
    description: new FormControl<string | undefined>(undefined),
    active: new FormControl<boolean | undefined>(undefined),
  });

  constructor(
    private dialogRef: MatDialogRef<EditOptionTypeDialogComponent>,
    private localOptionTypeService: LocalOptionTypeService
  ) {}

  public ngOnInit(): void {
    this.form.patchValue({
      description: this.optionTypeItem.description,
      active: this.optionTypeItem.active,
    });
  }

  public onSave(): void {
    const newDescription = this.form.value.description ?? undefined;
    const newActive = this.form.value.active ?? undefined;
    const optionUuid = this.optionTypeItem.uuid;
    const request = { description: newDescription };
    if (this.hasDescriptionChanged()) {
      this.localOptionTypeService.patchLocalOption(this.optionType, optionUuid, request);
    }
    if (newActive !== undefined && this.hasActiveChanged()) {
      this.localOptionTypeService.patchIsActive(this.optionType, optionUuid, newActive);
    }
    this.dialogRef.close();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public disableSaveButton(): boolean {
    return !this.form.valid || !this.hasValuesChanged();
  }

  private hasValuesChanged(): boolean {
    return this.hasDescriptionChanged() || this.hasActiveChanged();
  }

  private hasDescriptionChanged(): boolean {
    return this.form.value.description !== this.optionTypeItem.description;
  }

  private hasActiveChanged(): boolean {
    return this.form.value.active !== this.optionTypeItem.active;
  }
}
