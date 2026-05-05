import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { debounceTime, first, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { TooltipComponent } from 'src/app/shared/components/tooltip/tooltip.component';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from 'src/app/shared/constants/constants';
import { URL_VALIDATION_ERROR_MESSAGE } from 'src/app/shared/constants/error-message-constants';
import { isExternalReferenceUrlEmptyOrValid } from 'src/app/shared/helpers/link.helpers';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { ButtonComponent } from '../../../../../shared/components/buttons/button/button.component';
import { DialogActionsComponent } from '../../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from '../../../../../shared/components/dialogs/dialog/dialog.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxComponent } from '../../../../../shared/components/textbox/textbox.component';

@Component({
  selector: 'app-edit-url-dialog',
  templateUrl: './edit-url-dialog.component.html',
  styleUrls: ['./edit-url-dialog.component.scss'],
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    TextBoxComponent,
    ParagraphComponent,
    DialogActionsComponent,
    ButtonComponent,
    TooltipComponent,
    CommonModule,
  ],
})
export class EditSimpleLinkDialogComponent extends BaseComponent implements OnInit {
  @Input() simpleLink?: SimpleLink | undefined;
  @Input() namePermission$?: Observable<boolean>;
  @Input() nameDisabledMessage?: string;
  @Input() linkPermission$?: Observable<boolean>;
  @Input() linkDisabledMessage?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() submitMethod!: EventEmitter<any>;

  public readonly simpleLinkForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined),
    url: new FormControl<string | undefined>(undefined),
  });

  public isBusy = false;
  public showValidationError = false;

  public validationErrorMessage = URL_VALIDATION_ERROR_MESSAGE;

  constructor(
    private readonly dialogRef: MatDialogRef<EditSimpleLinkDialogComponent>,
    private readonly actions$: Actions,
  ) {
    super();
  }

  public disableSave() {
    return this.isBusy || this.hasNoChanges();
  }

  private urlIsInvalid() {
    return this.simpleLinkForm.controls.url.value === this.simpleLink?.url;
  }

  private hasNoChanges() {
    return this.urlIsInvalid() && this.simpleLinkForm.controls.name.value === this.simpleLink?.name;
  }

  ngOnInit(): void {
    if (this.simpleLink) {
      this.simpleLinkForm.patchValue({
        name: this.simpleLink.name,
        url: this.simpleLink.url,
      });
    }

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITSystemUsageActions.patchITSystemUsageSuccess), first())
        .subscribe(() => this.dialogRef.close()),
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITSystemUsageActions.patchITSystemUsageError)).subscribe(() => {
        this.isBusy = false;
      }),
    );

    this.subscriptions.add(
      this.simpleLinkForm.controls.url.valueChanges.pipe(debounceTime(DEFAULT_INPUT_DEBOUNCE_TIME)).subscribe(() => {
        this.showValidationError =
          isExternalReferenceUrlEmptyOrValid(this.simpleLinkForm.controls.url.value ?? undefined) === false;
      }),
    );

    if (this.namePermission$) {
      this.subscriptions.add(
        this.namePermission$.subscribe((hasPermission) => {
          this.toggleControl(hasPermission, this.simpleLinkForm.controls.name);
        }),
      );
    }
    if (this.linkPermission$) {
      this.subscriptions.add(
        this.linkPermission$.subscribe((hasPermission) => {
          this.toggleControl(hasPermission, this.simpleLinkForm.controls.url);
        }),
      );
    }
  }

  private toggleControl(hasPermission: boolean, control: FormControl<string | undefined | null>) {
    if (!hasPermission) {
      control.disable();
    } else {
      control.enable();
    }
  }

  onSave() {
    if (!this.simpleLinkForm.valid) return;
    const formValue = this.simpleLinkForm.getRawValue(); // Use getRawValue() to include disabled controls
    const name = formValue.name;
    const url = formValue.url;

    this.isBusy = true;
    this.submitMethod.emit({ name: name ?? '', url: url });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
