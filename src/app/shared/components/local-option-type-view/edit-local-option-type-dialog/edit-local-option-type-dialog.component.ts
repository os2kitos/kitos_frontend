
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  LocalAdminOptionType,
  LocalAdminOptionTypeItem,
} from 'src/app/shared/models/options/local-admin-option-type.model';
import { isRoleOptionType } from 'src/app/shared/models/options/role-option-types.model';
import { LocalOptionTypeActions } from 'src/app/store/local-admin/local-option-types/actions';
import { ButtonComponent } from '../../buttons/button/button.component';
import { CheckboxComponent } from '../../checkbox/checkbox.component';
import { DialogActionsComponent } from '../../dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from '../../dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextAreaComponent } from '../../textarea/textarea.component';
import { TextBoxComponent } from '../../textbox/textbox.component';

@Component({
  selector: 'app-edit-local-option-type-dialog',
  templateUrl: './edit-local-option-type-dialog.component.html',
  styleUrl: './edit-local-option-type-dialog.component.scss',
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    TextBoxComponent,
    CheckboxComponent,
    TextAreaComponent,
    DialogActionsComponent,
    ButtonComponent
],
})
export class EditLocalOptionTypeDialogComponent extends BaseComponent implements OnInit {
  @Input() optionTypeItem!: LocalAdminOptionTypeItem;
  @Input() optionType!: LocalAdminOptionType;
  @Input() showExternalUse: boolean = false;

  public form = new FormGroup({
    description: new FormControl<string | undefined>(undefined),
    isExternallyUsed: new FormControl<boolean>(false),
    externallyUsedDescription: new FormControl<string | undefined>(undefined),
  });

  constructor(private dialogRef: MatDialogRef<EditLocalOptionTypeDialogComponent>, private store: Store) {
    super();
  }

  public ngOnInit(): void {
    this.form.patchValue({
      description: this.optionTypeItem.description,
    });

    if (this.isRoleOptionType()) {
      this.setupRoleFields();
    }
  }

  public onSave(): void {
    const newDescription = this.form.value.description ?? undefined;

    const optionUuid = this.optionTypeItem.uuid;

    if (!this.hasFormChanged()) {
      return;
    }

    if (this.isRoleOptionType()) {
      const newIsExternallyUsed = this.form.value.isExternallyUsed ?? false;
      const newExternallyUsedDescription = this.form.value.externallyUsedDescription ?? undefined;

      const request = {
        description: newDescription,
        isExternallyUsed: newIsExternallyUsed,
        externallyUsedDescription: newExternallyUsedDescription,
      };

      this.store.dispatch(LocalOptionTypeActions.updateRoleOptionType(this.optionType, optionUuid, request));
    } else {
      const request = { description: newDescription };

      this.store.dispatch(LocalOptionTypeActions.uppdateOptionType(this.optionType, optionUuid, request));
    }

    this.dialogRef.close();
  }

  public isRoleOptionType(): boolean {
    return isRoleOptionType(this.optionType);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public disableSaveButton(): boolean {
    return !this.form.valid || !this.hasFormChanged();
  }

  private setupRoleFields() {
    this.form.patchValue({
      isExternallyUsed: this.optionTypeItem.isExternallyUsed ?? false,
      externallyUsedDescription: this.optionTypeItem.externallyUsedDescription,
    });
    const controls = this.form.controls;

    this.subscriptions.add(
      controls.isExternallyUsed.valueChanges.subscribe((isExternallyUsed) => {
        if (isExternallyUsed) {
          controls.externallyUsedDescription.enable();
        } else {
          controls.externallyUsedDescription.disable();
          controls.externallyUsedDescription.setValue(undefined);
        }
      })
    );

    // Set initial state
    const initialExternallyUsed = controls.isExternallyUsed.value;
    if (!initialExternallyUsed) {
      controls.externallyUsedDescription.disable();
    }
  }

  private hasFormChanged(): boolean {
    const descriptionChanged = this.form.value.description !== this.optionTypeItem.description;

    if (this.isRoleOptionType()) {
      const externallyUsedChanged =
        this.form.value.isExternallyUsed !== (this.optionTypeItem.isExternallyUsed ?? false);
      const externallyUsedDescriptionChanged =
        this.form.value.externallyUsedDescription !== this.optionTypeItem.externallyUsedDescription;
      return descriptionChanged || externallyUsedChanged || externallyUsedDescriptionChanged;
    }

    return descriptionChanged;
  }
}
