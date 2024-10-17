import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { isRoleOptionType } from 'src/app/shared/helpers/option-type-helpers';
import { RegularOptionType } from 'src/app/shared/models/options/regular-option-types.model';
import { RoleOptionTypes } from 'src/app/shared/models/options/role-option-types.model';
import { OptionTypeTableItem, OptionTypeTableOption } from '../option-type-table.component';
import { LocalRoleOptionTypeService } from 'src/app/shared/services/local-role-option-type.service';
import { LocalRegularOptionTypeService } from 'src/app/shared/services/local-regular-option-type.service';
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
    description: new FormControl<string | undefined>(undefined),
    active: new FormControl<boolean | undefined>(undefined),
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
    const newActive = this.form.value.active ?? undefined;
    const optionUuid = this.optionTypeItem.uuid;
    const request = { description: newDescription };
    if (this.hasDescriptionChanged()) {
      this.patchOptionType(optionUuid, request);
    }
    if (newActive !== undefined && this.hasActiveChanged()) {
      this.patchActiveStatus(optionUuid, newActive);
    }
    this.dialogRef.close();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public disableSaveButton(): boolean {
    return !this.form.valid || !this.hasValuesChanged();
  }

  private patchOptionType(optionUuid: string, request: APILocalRegularOptionUpdateRequestDTO): void {
    if (isRoleOptionType(this.optionType)) {
      this.localRoleOptionService.patchLocalRoleOption(this.optionType as RoleOptionTypes, optionUuid, request);
    } else {
      this.localRegularOptionService.patchLocalOption(this.optionType as RegularOptionType, optionUuid, request);
    }
  }

  private patchActiveStatus(optionUuid: string, isActive: boolean): void {
    if (isRoleOptionType(this.optionType)) {
      this.localRoleOptionService.patchIsActive(this.optionType as RoleOptionTypes, optionUuid, isActive);
    } else {
      this.localRegularOptionService.patchIsActive(this.optionType as RegularOptionType, optionUuid, isActive);
    }
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
