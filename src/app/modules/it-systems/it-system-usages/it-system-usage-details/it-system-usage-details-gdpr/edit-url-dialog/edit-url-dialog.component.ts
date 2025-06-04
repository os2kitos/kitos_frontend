import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { debounceTime, first } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from 'src/app/shared/constants/constants';
import { isUrlEmptyOrValid } from 'src/app/shared/helpers/link.helpers';
import { SimpleLink } from 'src/app/shared/models/SimpleLink.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { DialogComponent } from '../../../../../../shared/components/dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxComponent } from '../../../../../../shared/components/textbox/textbox.component';
import { NgIf } from '@angular/common';
import { ParagraphComponent } from '../../../../../../shared/components/paragraph/paragraph.component';
import { DialogActionsComponent } from '../../../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../../../shared/components/buttons/button/button.component';

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
    NgIf,
    ParagraphComponent,
    DialogActionsComponent,
    ButtonComponent,
  ],
})
export class EditUrlDialogComponent extends BaseComponent implements OnInit {
  @Input() simpleLink?: SimpleLink | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() submitMethod!: EventEmitter<any>;

  public readonly simpleLinkForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined),
    url: new FormControl<string | undefined>(undefined),
  });

  public isBusy = false;
  public showValidationError = false;

  constructor(
    private readonly dialogRef: MatDialogRef<EditUrlDialogComponent>,
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
        this.showValidationError = isUrlEmptyOrValid(this.simpleLinkForm.value.url ?? undefined) === false;
      }),
    );
  }

  onSave() {
    if (!this.simpleLinkForm.valid) return;
    const name = this.simpleLinkForm.value.name;
    const url = this.simpleLinkForm.value.url;

    this.isBusy = true;
    this.submitMethod.emit({ name: name ?? '', url: url });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
