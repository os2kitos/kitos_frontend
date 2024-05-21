import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatestWith, first, map } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { selectDataProcessingTransferToCountries } from 'src/app/store/data-processing/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypes } from 'src/app/store/regular-option-type-store/selectors';

@Component({
  selector: 'app-country-create-dialog',
  templateUrl: './country-create-dialog.component.html',
  styleUrl: './country-create-dialog.component.scss',
})
export class CountryCreateDialogComponent extends BaseComponent implements OnInit {
  public readonly thirdCountries$ = this.store.select(selectRegularOptionTypes('data-processing-country-types')).pipe(
    combineLatestWith(this.store.select(selectDataProcessingTransferToCountries).pipe(filterNullish())),
    map(([thirdCountriesOptions, existingCountries]) => {
      if (!thirdCountriesOptions) return [];

      return thirdCountriesOptions.filter(
        (option) => !existingCountries.some((country) => country.uuid === option.uuid)
      );
    })
  );

  public readonly thirdCountriesFormGroup = new FormGroup({
    thirdCountry: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined, [Validators.required]),
  });

  constructor(
    private store: Store,
    private dialog: MatDialogRef<CountryCreateDialogComponent>,
    private actions$: Actions
  ) {
    super();
  }

  public isBusy = false;

  ngOnInit(): void {
    this.store.dispatch(RegularOptionTypeActions.getOptions('data-processing-country-types'));

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
    if (this.thirdCountriesFormGroup.invalid || !this.thirdCountriesFormGroup.value.thirdCountry) {
      return;
    }
    this.isBusy = true;

    this.store
      .select(selectDataProcessingTransferToCountries)
      .pipe(first())
      .subscribe((countries) => {
        this.store.dispatch(
          DataProcessingActions.addDataProcessingThirdCountry(
            this.thirdCountriesFormGroup.value.thirdCountry!,
            countries
          )
        );
      });
  }

  public onClose() {
    this.dialog.close();
  }
}
