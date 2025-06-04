import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, forwardRef, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs';
import { APIHelpTextCreateRequestDTO } from 'src/app/api/v2/model/helpTextCreateRequestDTO';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { AppRootUrlResolverService } from 'src/app/shared/services/app-root-url-resolver.service';
import { HelpTextActions } from 'src/app/store/global-admin/help-texts/actions';
import { ButtonComponent } from '../../buttons/button/button.component';
import { DividerComponent } from '../../divider/divider.component';
import { ParagraphComponent } from '../../paragraph/paragraph.component';
import { RichTextEditorComponent } from '../../rich-text-editor/rich-text-editor.component';
import { StandardVerticalContentGridComponent } from '../../standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxComponent } from '../../textbox/textbox.component';
import { DialogActionsComponent } from '../dialog-actions/dialog-actions.component';
import { DialogComponent } from '../dialog/dialog.component';
import { CreateHelpTextDialogComponentStore } from './create-help-text-dialog.component-store';

@Component({
  selector: 'app-create-help-text-dialog',
  templateUrl: './create-help-text-dialog.component.html',
  styleUrl: './create-help-text-dialog.component.scss',
  providers: [CreateHelpTextDialogComponentStore],
  imports: [
    forwardRef(() => DialogComponent),
    CommonModule,
    StandardVerticalContentGridComponent,
    TextBoxComponent,
    FormsModule,
    ReactiveFormsModule,
    ParagraphComponent,
    DividerComponent,
    RichTextEditorComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class CreateHelpTextDialogComponent extends BaseComponent implements OnInit {
  @Input() existingKey: string | undefined;

  public readonly formGroup = new FormGroup({
    key: new FormControl<string | undefined>(undefined, Validators.required),
    title: new FormControl<string | undefined>(undefined, Validators.required),
    description: new FormControl<string | undefined>(undefined),
  });

  public readonly keyExists$ = this.componentStore.keyExists$;
  public readonly isLoading$ = this.componentStore.isLoading$;
  public rootUrl: string;

  constructor(
    @Inject(MatDialogRef<CreateHelpTextDialogComponent>) private dialogRef: MatDialogRef<CreateHelpTextDialogComponent>,
    private store: Store,
    private componentStore: CreateHelpTextDialogComponentStore,
    private rootUrlResolver: AppRootUrlResolverService,
  ) {
    super();
    this.rootUrl = this.rootUrlResolver.resolveRootUrl();
  }

  ngOnInit(): void {
    const keyControl = this.formGroup.controls.key;
    this.subscriptions.add(
      keyControl.valueChanges.pipe(debounceTime(300)).subscribe((key) => {
        if (!key) return;
        this.componentStore.checkIfKeyExists(key);
      }),
    );

    if (this.existingKey) {
      this.formGroup.patchValue({
        key: this.existingKey,
      });
      keyControl.disable();
    }
  }

  public onCreateHelpText(): void {
    const value = this.formGroup.value;
    const key = this.existingKey ?? value.key;
    if (!this.formGroup.valid || !key || !value.title) return;

    const dto: APIHelpTextCreateRequestDTO = {
      key,
      title: value.title,
      description: value.description ?? undefined,
    };

    this.store.dispatch(HelpTextActions.createHelpText(dto));
    this.dialogRef.close();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
