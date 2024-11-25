import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { APIGlobalRoleOptionCreateRequestDTO, APIGlobalRoleOptionUpdateRequestDTO } from 'src/app/api/v2';
import {
  GlobalAdminOptionType,
  GlobalAdminOptionTypeItem,
} from 'src/app/shared/models/options/global-admin-option-type.model';
import { isRoleOptionType } from 'src/app/shared/models/options/role-option-types.model';
import { GlobalOptionTypeActions } from 'src/app/store/global-admin/global-option-types/actions';

@Component({
  selector: 'app-global-option-type-dialog',
  templateUrl: './global-option-type-dialog.component.html',
  styleUrl: './global-option-type-dialog.component.scss',
})
export class GlobalOptionTypeDialogComponent implements OnInit {
  @Input() optionTypeItem!: GlobalAdminOptionTypeItem;
  @Input() optionType!: GlobalAdminOptionType;
  @Input() action!: 'create' | 'edit';

  public form = new FormGroup({
    description: new FormControl<string | undefined>(undefined),
    name: new FormControl<string | undefined>(undefined, Validators.required),
    obligatory: new FormControl<boolean | undefined>(undefined),
    writeAccess: new FormControl<boolean | undefined>(undefined),
  });

  constructor(private dialogRef: MatDialogRef<GlobalOptionTypeDialogComponent>, private store: Store) {}

  public ngOnInit(): void {
    if (this.isEditDialog()) {
      this.form.patchValue({
        description: this.optionTypeItem.description,
        obligatory: this.optionTypeItem.obligatory,
        name: this.optionTypeItem.name,
        writeAccess: this.optionTypeItem.writeAccess,
      });
    }
  }

  public onSave(): void {
    const formValue = this.form.value;
    const description = formValue.description ?? undefined;
    const name = formValue.name ?? undefined;
    const isObligatory = formValue.obligatory ?? undefined;

    const request: APIGlobalRoleOptionUpdateRequestDTO | APIGlobalRoleOptionCreateRequestDTO = {
      description,
      name,
      isObligatory,
    };
    if (this.isRoleOption()) {
      const writeAccess = formValue.writeAccess ?? undefined;
      request.writeAccess = writeAccess;
    }

    if (this.isEditDialog()) {
      const optionUuid = this.optionTypeItem.uuid;
      this.store.dispatch(GlobalOptionTypeActions.updateOptionType(this.optionType, optionUuid, request));
    } else {
      this.store.dispatch(GlobalOptionTypeActions.createOptionType(this.optionType, request));
    }

    this.dialogRef.close();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public isRoleOption() {
    return isRoleOptionType(this.optionType);
  }

  private isEditDialog() {
    return this.action === 'edit';
  }

  public getDialogTitle(): string {
    return this.isEditDialog() ? $localize`Rediger` : $localize`Opret`;
  }

  public disableSaveButton(): boolean {
    if (!this.isEditDialog()) return !this.form.valid;
    return !this.form.valid || !this.haveValuesChanged();
  }

  private haveValuesChanged(): boolean {
    return (
      this.hasDescriptionChanged() ||
      this.hasObligatoryChanged() ||
      this.hasNameChanged() ||
      this.hasWriteAccessChanged()
    );
  }

  private hasWriteAccessChanged() {
    return this.isRoleOption() ? this.form.value.writeAccess !== this.optionTypeItem.writeAccess : false;
  }

  private hasDescriptionChanged(): boolean {
    return this.form.value.description !== this.optionTypeItem.description;
  }

  private hasObligatoryChanged(): boolean {
    return this.form.value.obligatory !== this.optionTypeItem.obligatory;
  }

  private hasNameChanged(): boolean {
    return this.form.value.name !== this.optionTypeItem.name;
  }
}
