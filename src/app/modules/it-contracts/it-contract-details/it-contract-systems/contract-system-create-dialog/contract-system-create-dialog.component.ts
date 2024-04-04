import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, map } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { selectItContractSystemUsages } from 'src/app/store/it-contract/selectors';
import { ItContractSystemCreateDialogComponentStore } from './contract-system-create-dialog.component-store';

@Component({
  selector: 'app-contract-system-create-dialog',
  templateUrl: './contract-system-create-dialog.component.html',
  styleUrl: './contract-system-create-dialog.component.scss',
  providers: [ItContractSystemCreateDialogComponentStore],
})
export class ContractSystemCreateDialogComponent extends BaseComponent implements OnInit {
  public readonly systemUsages$ = this.componentStore.systemUsages$.pipe(
    combineLatestWith(this.store.select(selectItContractSystemUsages).pipe(filterNullish())),
    map(([systemUsages, contractSystemUsages]) =>
      systemUsages.filter(
        (systemUsage) =>
          !contractSystemUsages.some((contractSystemUsage) => contractSystemUsage.uuid === systemUsage.uuid)
      )
    )
  );
  public readonly systemUsagesIsLoading$ = this.componentStore.systemUsagesIsLoading$;

  public systemUsageForm = new FormGroup({
    systemUsage: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined, Validators.required),
  });

  public isBusy = false;

  constructor(
    private readonly store: Store,
    private readonly componentStore: ItContractSystemCreateDialogComponentStore,
    private readonly dialogRef: MatDialogRef<ContractSystemCreateDialogComponent>,
    private readonly actions$: Actions
  ) {
    super();
  }

  ngOnInit(): void {
    this.actions$.pipe(ofType(ITContractActions.addITContractSystemUsageSuccess)).subscribe(() => {
      this.dialogRef.close();
    });

    this.actions$.pipe(ofType(ITContractActions.addITContractSystemUsageError)).subscribe(() => {
      this.isBusy = false;
    });
    this.searchUsages();
  }

  public save(): void {
    if (this.systemUsageForm.valid) {
      this.isBusy = true;
      const systemUsage = this.systemUsageForm.value.systemUsage;
      if (!systemUsage) {
        this.isBusy = false;
        return;
      }

      this.store.dispatch(ITContractActions.addITContractSystemUsage(systemUsage.uuid));
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public searchUsages(search?: string): void {
    this.componentStore.searchSystemUsages(search);
  }
}
