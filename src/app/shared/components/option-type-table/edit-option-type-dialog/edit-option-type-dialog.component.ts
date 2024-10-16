import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { OptionTypeTableItem, OptionTypeTableOption } from '../option-type-table.component';
import { isRoleOptionType } from 'src/app/shared/helpers/option-type-helpers';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { RegularOptionTypeService } from 'src/app/shared/services/regular-option-type.service';
import { RegularOptionType } from 'src/app/shared/models/options/regular-option-types.model';
import { APILocalRegularOptionUpdateRequestDTO } from 'src/app/api/v2';

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
    const newChoiceTypeItem: OptionTypeTableItem = { ...this.optionTypeItem, description: newDescription };
    if (isRoleOptionType(this.optionType)) {
      // do one thing
    } else {
      console.log('patchLocalOption');
      this.regularOptionTypeService.patchLocalOption(
        this.optionType as RegularOptionType,
        newChoiceTypeItem.uuid,
        this.mapToUpdateOptionDTO(newChoiceTypeItem)
      );
    }
    this.dialogRef.close();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public disableSaveButton(): boolean {
    return !this.form.valid || this.form.value.description === this.optionTypeItem.description;
  }

  private mapToUpdateOptionDTO(optionTypeItem: OptionTypeTableItem): APILocalRegularOptionUpdateRequestDTO {
    return {
      description: optionTypeItem.description,
    };
  }
}
