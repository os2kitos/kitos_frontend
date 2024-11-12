import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  LocalAdminOptionType,
  LocalAdminOptionTypeItem,
} from 'src/app/shared/models/options/local-admin-option-type.model';
import { LocalOptionTypeActions } from 'src/app/store/local-admin/local-option-types/actions';

@Component({
  selector: 'app-edit-local-option-type-dialog',
  templateUrl: './edit-local-option-type-dialog.component.html',
  styleUrl: './edit-local-option-type-dialog.component.scss',
})
export class EditLocalOptionTypeDialogComponent implements OnInit {
  @Input() optionTypeItem!: LocalAdminOptionTypeItem;
  @Input() optionType!: LocalAdminOptionType;

  public form = new FormGroup({
    description: new FormControl<string | undefined>(undefined),
    active: new FormControl<boolean | undefined>(undefined),
  });

  constructor(private dialogRef: MatDialogRef<EditLocalOptionTypeDialogComponent>, private store: Store) {}

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
      this.store.dispatch(LocalOptionTypeActions.uppdateOptionType(this.optionType, optionUuid, request));
    }
    if (newActive !== undefined && this.hasActiveChanged()) {
      this.store.dispatch(LocalOptionTypeActions.updateOptionTypeActiveStatus(this.optionType, optionUuid, newActive));
    }
    this.dialogRef.close();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public disableSaveButton(): boolean {
    return !this.form.valid || !this.haveValuesChanged();
  }

  private haveValuesChanged(): boolean {
    return this.hasDescriptionChanged() || this.hasActiveChanged();
  }

  private hasDescriptionChanged(): boolean {
    return this.form.value.description !== this.optionTypeItem.description;
  }

  private hasActiveChanged(): boolean {
    return this.form.value.active !== this.optionTypeItem.active;
  }
}
