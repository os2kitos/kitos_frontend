import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { APIIdentityNamePairResponseDTO, APIItInterfaceDataResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';

@Component({
  selector: 'app-interface-data-write-dialog',
  templateUrl: './interface-data-write-dialog.component.html',
  styleUrl: './interface-data-write-dialog.component.scss',
})
export class InterfaceDataWriteDialogComponent extends BaseComponent implements OnInit {
  @Input() public existingData: APIItInterfaceDataResponseDTO | undefined;

  public readonly simpleLinkForm = new FormGroup({
    description: new FormControl<string | undefined>(undefined),
    dataType: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
  });

  public isBusy = false;

  constructor(
    private readonly dialogRef: MatDialogRef<InterfaceDataWriteDialogComponent>,
    private readonly store: Store,
    private readonly actions$: Actions
  ) {
    super();
  }
  ngOnInit(): void {
    if (this.existingData) {
      this.simpleLinkForm.patchValue({
        description: this.existingData.description,
        dataType: this.existingData.dataType,
      });
    }

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.addITInterfaceDataSuccess, ITInterfaceActions.updateITInterfaceDataSuccess))
        .subscribe(() => this.dialogRef.close())
    );

    this.subscriptions.add(
      this.actions$
        .pipe(ofType(ITInterfaceActions.addITInterfaceDataError, ITInterfaceActions.updateITInterfaceDataError))
        .subscribe(() => {
          this.isBusy = false;
        })
    );
  }

  public onSaveClick() {
    this.isBusy = true;

    const description = this.simpleLinkForm.value.description ?? undefined;
    const dataTypeUuid = this.simpleLinkForm.value.dataType?.uuid;
    const request = { description, dataTypeUuid };

    if (this.existingData?.uuid) {
      this.store.dispatch(ITInterfaceActions.updateITInterfaceData(this.existingData.uuid, request));
    } else {
      this.store.dispatch(ITInterfaceActions.addITInterfaceData(request));
    }
  }
}
