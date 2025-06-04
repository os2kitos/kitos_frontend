import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APIItInterfaceDataResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';
import { DialogComponent } from '../../../../../../shared/components/dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxComponent } from '../../../../../../shared/components/textbox/textbox.component';
import { DropdownComponent } from '../../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { DialogActionsComponent } from '../../../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../../../shared/components/buttons/button/button.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-interface-data-write-dialog',
  templateUrl: './interface-data-write-dialog.component.html',
  styleUrl: './interface-data-write-dialog.component.scss',
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    TextBoxComponent,
    DropdownComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class InterfaceDataWriteDialogComponent extends BaseComponent implements OnInit {
  @Input() public existingData: APIItInterfaceDataResponseDTO | undefined;

  public readonly dataTypes$ = this.store.select(selectRegularOptionTypes('it-interface_data-type'));

  public readonly dataForm = new FormGroup({
    description: new FormControl<string | undefined>(undefined),
    dataType: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
  });

  public isBusy = false;

  constructor(
    private readonly dialogRef: MatDialogRef<InterfaceDataWriteDialogComponent>,
    private readonly store: Store,
    private readonly actions$: Actions,
  ) {
    super();
  }
  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-interface_data-type'));

    if (this.existingData) {
      this.dataForm.patchValue({
        description: this.existingData.description,
        dataType: this.existingData.dataType,
      });
    }

    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(ITInterfaceActions.addITInterfaceDataSuccess, ITInterfaceActions.updateITInterfaceDataSuccess),
          first(),
        )
        .subscribe(() => this.dialogRef.close()),
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.addITInterfaceDataError, ITInterfaceActions.updateITInterfaceDataError))
        .subscribe(() => {
          this.isBusy = false;
        }),
    );
  }

  public onSaveClick() {
    this.isBusy = true;

    const description = this.dataForm.value.description ?? undefined;
    const dataTypeUuid = this.dataForm.value.dataType?.uuid;
    const request = { description, dataTypeUuid };

    if (this.existingData?.uuid) {
      this.store.dispatch(ITInterfaceActions.updateITInterfaceData(this.existingData.uuid, request));
    } else {
      this.store.dispatch(ITInterfaceActions.addITInterfaceData(request));
    }
  }

  public onCancelClick() {
    this.dialogRef.close(false);
  }
}
