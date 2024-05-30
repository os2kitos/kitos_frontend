import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { selectDataProcessingSystems } from 'src/app/store/data-processing/selectors';
import { CreateDprSystemUsageDialogComponentStore } from './create-dpr-system-usage.component-store';

@Component({
  selector: 'app-create-dpr-system-usage',
  templateUrl: './create-dpr-system-usage.component.html',
  styleUrl: './create-dpr-system-usage.component.scss',
  providers: [CreateDprSystemUsageDialogComponentStore],
})
export class CreateDprSystemUsageComponent extends BaseComponent implements OnInit {
  public readonly systemUsages$ = this.componentStore.systemUsages$;

  public readonly systemUsageFormGroup = new FormGroup({
    systemUsage: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined, Validators.required),
  });

  constructor(
    private store: Store,
    private componentStore: CreateDprSystemUsageDialogComponentStore,
    private actions$: Actions,
    private dialog: MatDialogRef<CreateDprSystemUsageComponent>
  ) {
    super();
  }

  public isBusy = false;

  public ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(DataProcessingActions.patchDataProcessingSuccess)).subscribe(() => {
        this.dialog.close();
      })
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(DataProcessingActions.patchDataProcessingError)).subscribe(() => {
        this.isBusy = false;
      })
    );
  }

  public addSystemUsage(): void {
    if (this.systemUsageFormGroup.invalid) {
      return;
    }
    const systemUsage = this.systemUsageFormGroup.controls.systemUsage.value;
    if (!systemUsage) {
      return;
    }
    const systemUsageUuid = systemUsage.uuid;
    this.isBusy = true;

    this.store
      .select(selectDataProcessingSystems)
      .pipe(first())
      .subscribe((systemUsages) => {
        this.store.dispatch(
          DataProcessingActions.addDataProcessingSystemUsage(
            systemUsageUuid,
            systemUsages?.map((usage) => usage.uuid)
          )
        );
      });
  }

  public search(term?: string): void {
    this.componentStore.getSystemUsages(term);
  }

  public onClose(): void {
    this.dialog.close();
  }
}
