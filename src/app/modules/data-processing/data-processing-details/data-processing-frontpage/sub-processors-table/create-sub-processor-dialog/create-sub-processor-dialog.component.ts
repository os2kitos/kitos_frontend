import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { CreateProcessorDialogComponentStore } from '../../processors-table/create-processor-dialog/create-processor-dialog.component-store';
import { CountryCreateDialogComponent } from '../../third-countries-table/country-create-dialog/country-create-dialog.component';
import { CreateSubProcessorDialogComponentStore } from './create-sub-processor-dialog.component-store';

@Component({
  selector: 'app-create-sub-processor-dialog',
  templateUrl: './create-sub-processor-dialog.component.html',
  styleUrl: './create-sub-processor-dialog.component.scss',
  providers: [CreateSubProcessorDialogComponentStore],
})
export class CreateSubProcessorDialogComponent extends BaseComponent implements OnInit {
  public readonly organizations$ = this.componentStore.organizations$;

  public readonly subprocessorsFormGroup = new FormGroup({
    subprocessor: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined, [Validators.required]),
  });

  constructor(
    private store: Store,
    private dialog: MatDialogRef<CountryCreateDialogComponent>,
    private actions$: Actions,
    private componentStore: CreateProcessorDialogComponentStore
  ) {
    super();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
