import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs';
import { APIHelpTextCreateRequestDTO } from 'src/app/api/v2/model/helpTextCreateRequestDTO';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { HelpTextActions } from 'src/app/store/global-admin/help-texts/actions';
import { CreateHelpTextDialogComponentStore } from './create-help-text-dialog.component-store';

@Component({
  selector: 'app-create-help-text-dialog',
  templateUrl: './create-help-text-dialog.component.html',
  styleUrl: './create-help-text-dialog.component.scss',
  providers: [CreateHelpTextDialogComponentStore],
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

  constructor(
    private dialogRef: MatDialogRef<CreateHelpTextDialogComponent>,
    private store: Store,
    private componentStore: CreateHelpTextDialogComponentStore
  ) {
    super();
  }

  ngOnInit(): void {
    const keyControl = this.formGroup.controls.key;
    this.subscriptions.add(
      keyControl.valueChanges.pipe(debounceTime(300)).subscribe((key) => {
        if (!key) return;
        this.componentStore.checkIfKeyExists(key);
      })
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
