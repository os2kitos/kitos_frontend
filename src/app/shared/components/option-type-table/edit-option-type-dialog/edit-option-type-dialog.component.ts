import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { isRoleOptionType } from 'src/app/shared/helpers/option-type-helpers';
import { RegularOptionType } from 'src/app/shared/models/options/regular-option-types.model';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { OptionTypeTableItem, OptionTypeTableOption } from '../option-type-table.component';
import { LocalRoleOptionTypeService } from 'src/app/shared/services/local-role-option-type.service';
import { LocalRegularOptionTypeService } from 'src/app/shared/services/local-regular-option-type.service';

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
    active: new FormControl<boolean>(false),
  });

  constructor(
    private dialogRef: MatDialogRef<EditOptionTypeDialogComponent>,
    private localRoleOptionService: LocalRoleOptionTypeService,
    private localRegularOptionService: LocalRegularOptionTypeService
  ) {}

  public ngOnInit(): void {
    this.form.patchValue({
      description: this.optionTypeItem.description,
      active: this.optionTypeItem.active,
    });
  }

  public onSave(): void {
    const newDescription = this.form.value.description ?? undefined;
    if (!newDescription) return;
    const optionUuid = this.optionTypeItem.uuid;
    const request = { description: newDescription };
    if (isRoleOptionType(this.optionType)) {
      this.localRoleOptionService.patchLocalRoleOption(this.optionType as RoleOptionTypes, optionUuid, request);
    } else {
      this.localRegularOptionService.patchLocalOption(this.optionType as RegularOptionType, optionUuid, request);
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
    const formValue = this.form.value;
    const option = this.optionTypeItem;
    return formValue.description !== option.description || formValue.active !== option.active;
  }
}
