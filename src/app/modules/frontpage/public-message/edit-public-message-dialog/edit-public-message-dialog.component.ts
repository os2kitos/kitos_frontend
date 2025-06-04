import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs';
import { APIPublicMessageRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from 'src/app/shared/constants/constants';
import { isUrlEmptyOrValid } from 'src/app/shared/helpers/link.helpers';
import { iconTypeOptions, PublicMessageIconType } from 'src/app/shared/models/public-messages/icon-type.model';
import { PublicMessage } from 'src/app/shared/models/public-messages/public-message.model';
import { StatusType, statusTypeOptions } from 'src/app/shared/models/public-messages/status-type.model';
import { GlobalAdminPublicMessageActions } from 'src/app/store/global-admin/public-messages/actions';
import { ScrollbarDialogComponent } from '../../../../shared/components/dialogs/dialog/scrollbar-dialog/scrollbar-dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxComponent } from '../../../../shared/components/textbox/textbox.component';
import { NgIf } from '@angular/common';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { DropdownComponent } from '../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { TextAreaComponent } from '../../../../shared/components/textarea/textarea.component';
import { RichTextEditorComponent } from '../../../../shared/components/rich-text-editor/rich-text-editor.component';
import { DialogActionsComponent } from '../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-edit-public-message-dialog',
  templateUrl: './edit-public-message-dialog.component.html',
  styleUrl: './edit-public-message-dialog.component.scss',
  imports: [
    ScrollbarDialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    TextBoxComponent,
    NgIf,
    ParagraphComponent,
    DropdownComponent,
    TextAreaComponent,
    RichTextEditorComponent,
    DialogActionsComponent,
    ButtonComponent,
  ],
})
export class EditPublicMessageDialogComponent extends BaseComponent implements OnInit {
  @Input() publicMessage!: PublicMessage;

  private readonly maxDefaultDescriptionLength = 105;
  private readonly maxMainDescriptionLength = 200;
  private readonly maxTitleLength = 50;

  public formGroup = new FormGroup({
    title: new FormControl<string | undefined>(undefined, [
      Validators.required,
      Validators.maxLength(this.maxTitleLength),
    ]),
    status: new FormControl<StatusType | undefined>(undefined),
    shortDescription: new FormControl<string | undefined>(undefined, [
      Validators.required,
      Validators.maxLength(this.maxDefaultDescriptionLength),
    ]),
    longDescription: new FormControl<string | undefined>(undefined),
    url: new FormControl<string | undefined>(undefined),
    iconType: new FormControl<PublicMessageIconType | undefined>(undefined),
  });

  public readonly statusTypeOptions = statusTypeOptions;
  public readonly iconTypeOptions = iconTypeOptions;

  public showUrlError = false;

  constructor(
    private store: Store,
    private actions$: Actions,
    private dialogRef: MatDialogRef<EditPublicMessageDialogComponent>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(GlobalAdminPublicMessageActions.editPublicMessagesSuccess)).subscribe(() => {
        this.close();
      }),
    );

    this.subscriptions.add(
      this.formGroup.controls.url.valueChanges.pipe(debounceTime(DEFAULT_INPUT_DEBOUNCE_TIME)).subscribe((url) => {
        this.showUrlError = !isUrlEmptyOrValid(url ?? undefined);
      }),
    );

    const maxLength = this.publicMessage.isMain ? this.maxMainDescriptionLength : this.maxDefaultDescriptionLength;
    this.formGroup.controls.shortDescription.setValidators([Validators.required, Validators.maxLength(maxLength)]);
    this.formGroup.patchValue({
      title: this.publicMessage.title,
      status: this.publicMessage.status,
      shortDescription: this.publicMessage.shortDescription,
      longDescription: this.publicMessage.longDescription,
      url: this.publicMessage.link,
      iconType: this.publicMessage.iconType,
    });
  }

  public close(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    const messageUuid = this.publicMessage.uuid;
    const request = this.createRequest();
    this.store.dispatch(GlobalAdminPublicMessageActions.editPublicMessages(messageUuid, request));
  }

  private createRequest(): APIPublicMessageRequestDTO {
    const value = this.formGroup.value;
    return {
      title: value.title ?? undefined,
      shortDescription: value.shortDescription ?? undefined,
      longDescription: value.longDescription ?? undefined,
      link: value.url ?? undefined,
      status: this.getStatusValue(),
      iconType: this.getIconTypeValue() ?? undefined,
      isMain: this.publicMessage.isMain,
    };
  }

  private getStatusValue(): APIPublicMessageRequestDTO.StatusEnum | undefined {
    const value = this.formGroup.value.status?.value ?? null;
    //We need to allow null, to reset the value, but the generateed model does not allow it, so we have to cast (28/02/2025)
    return value as APIPublicMessageRequestDTO.StatusEnum | undefined;
  }

  private getIconTypeValue(): APIPublicMessageRequestDTO.IconTypeEnum | undefined {
    const value = this.formGroup.value.iconType?.value ?? null;
    return value as APIPublicMessageRequestDTO.IconTypeEnum | undefined;
  }
}
