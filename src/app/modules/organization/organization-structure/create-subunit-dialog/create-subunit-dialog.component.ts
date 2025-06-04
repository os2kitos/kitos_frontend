import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { STRING_FIELD_MAX_LENGTH } from 'src/app/shared/constants/constants';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import { DialogComponent } from '../../../../shared/components/dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxComponent } from '../../../../shared/components/textbox/textbox.component';
import { NumericInputComponent } from '../../../../shared/components/numeric-input/numeric-input.component';
import { DialogActionsComponent } from '../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-create-subunit-dialog',
  templateUrl: './create-subunit-dialog.component.html',
  styleUrl: './create-subunit-dialog.component.scss',
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    TextBoxComponent,
    NumericInputComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class CreateSubunitDialogComponent {
  @Input() parentUnitUuid$!: Observable<string>;
  @Input() parentUnitName$!: Observable<string>;

  public createForm = new FormGroup({
    name: new FormControl<string | undefined>(undefined, [
      Validators.required,
      Validators.maxLength(STRING_FIELD_MAX_LENGTH),
    ]),
    ean: new FormControl<number | undefined>(undefined),
    localId: new FormControl<string | undefined>(undefined, Validators.maxLength(STRING_FIELD_MAX_LENGTH)),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateSubunitDialogComponent>,
    private store: Store,
  ) {}

  public onCreate(): void {
    this.createSubunit();
    this.dialogRef.close();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private createSubunit(): void {
    const name = this.createForm.controls.name.value;
    const ean = this.createForm.controls.ean.value;
    const localId = this.createForm.controls.localId.value;
    if (!name) return; // Don't think this is possible, but satisfies the type checker (09/09/2024)
    this.parentUnitUuid$.pipe(first()).subscribe((parentUuid) => {
      this.store.dispatch(
        OrganizationUnitActions.createOrganizationSubunit({
          parentUuid: parentUuid,
          name,
          ean: ean ?? undefined,
          localId: localId ?? undefined,
        }),
      );
    });
  }
}
