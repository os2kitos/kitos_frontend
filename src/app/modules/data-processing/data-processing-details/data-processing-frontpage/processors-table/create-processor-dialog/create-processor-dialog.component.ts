import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { selectDataProcessingProcessors } from 'src/app/store/data-processing/selectors';
import { CountryCreateDialogComponent } from '../../third-countries-table/country-create-dialog/country-create-dialog.component';
import { CreateProcessorDialogComponentStore } from './create-processor-dialog.component-store';

@Component({
  selector: 'app-create-processor-dialog',
  templateUrl: './create-processor-dialog.component.html',
  styleUrl: './create-processor-dialog.component.scss',
  providers: [CreateProcessorDialogComponentStore],
})
export class CreateProcessorDialogComponent extends BaseComponent implements OnInit {
  public readonly organizations$ = this.componentStore.organizations$;

  public readonly processorsFormGroup = new FormGroup({
    processor: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined, [Validators.required]),
  });

  constructor(
    private store: Store,
    private dialog: MatDialogRef<CountryCreateDialogComponent>,
    private actions$: Actions,
    private componentStore: CreateProcessorDialogComponentStore
  ) {
    super();
  }

  public isBusy = false;

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(DataProcessingActions.patchDataProcessingSuccess)).subscribe(() => {
        this.onClose();
      })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(DataProcessingActions.patchDataProcessingError)).subscribe(() => {
        this.isBusy = false;
      })
    );
  }

  public onSubmit() {
    if (this.processorsFormGroup.invalid || !this.processorsFormGroup.value.processor) {
      return;
    }
    this.isBusy = true;

    this.store
      .select(selectDataProcessingProcessors)
      .pipe(first())
      .subscribe((processors) => {
        this.store.dispatch(
          DataProcessingActions.addDataProcessingProcessor(this.processorsFormGroup.value.processor!, processors)
        );
      });
  }

  public onClose() {
    this.dialog.close();
  }

  public searchOrganizations(search?: string) {
    this.componentStore.getOrganizations(search);
  }
}
