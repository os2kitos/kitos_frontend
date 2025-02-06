import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { APIHelpTextUpdateRequestDTO } from 'src/app/api/v2/model/helpTextUpdateRequestDTO';
import { HelpText } from 'src/app/shared/models/help-text.model';
import { AppRootUrlResolverService } from 'src/app/shared/services/app-root-url-resolver.service';
import { HelpTextActions } from 'src/app/store/global-admin/help-texts/actions';

@Component({
  selector: 'app-edit-help-text-dialog',
  templateUrl: './edit-help-text-dialog.component.html',
  styleUrl: './edit-help-text-dialog.component.scss',
})
export class EditHelpTextDialogComponent implements OnInit {
  @Input() helpText!: HelpText;

  public rootUrl: string;
  public readonly formGroup = new FormGroup({
    key: new FormControl<string | undefined>({
      value: undefined,
      disabled: true,
    }),
    title: new FormControl<string | undefined>(undefined, Validators.required),
    description: new FormControl<string | undefined>(undefined),
  });

  constructor(
    private readonly dialogRef: MatDialogRef<EditHelpTextDialogComponent>,
    private store: Store,
    private rootUrlResolver: AppRootUrlResolverService
  ) {
    this.rootUrl = this.rootUrlResolver.resolveRootUrl();
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      key: this.helpText.Key,
      title: this.helpText.Title,
      description: this.helpText.Description,
    });
  }

  public onEditHelpText() {
    const key = this.helpText.Key;
    const value = this.formGroup.value;
    if (!this.formGroup.valid || !key || !value.title) return;
    const dto: APIHelpTextUpdateRequestDTO = {
      title: value.title,
      description: value.description ?? undefined,
    };
    this.store.dispatch(HelpTextActions.updateHelpText(key, dto));
    this.dialogRef.close();
  }

  public onCancel() {
    this.dialogRef.close();
  }
}
