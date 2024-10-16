import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { isRoleOptionType } from 'src/app/shared/helpers/option-type-helpers';
import { RegularOptionType } from 'src/app/shared/models/options/regular-option-types.model';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { RegularOptionTypeService } from 'src/app/shared/services/regular-option-type.service';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
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
    private roleOptionTypeService: RoleOptionTypeService,
    private regularOptionTypeService: RegularOptionTypeService
  ) {}

  public ngOnInit(): void {
    this.form.patchValue({
      description: this.optionTypeItem.description,
    });
  }

  public onSave(): void {
    const newDescription = this.form.value.description ?? undefined;
    if (!newDescription) return;
    const optionUuid = this.optionTypeItem.uuid;
    const request = { description: newDescription };
    if (isRoleOptionType(this.optionType)) {
      this.roleOptionTypeService.patchLocalRoleOption(this.optionType as RoleOptionTypes, optionUuid, request);
    } else {
      this.regularOptionTypeService.patchLocalOption(this.optionType as RegularOptionType, optionUuid, request);
    }
    this.dialogRef.close();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public disableSaveButton(): boolean {
    return !this.form.valid || this.form.value.description === this.optionTypeItem.description;
  }
}
