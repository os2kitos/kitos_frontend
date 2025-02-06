import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { first, switchMap, tap } from 'rxjs';
import { ShallowOptionType } from 'src/app/shared/models/options/option-type.model';
import { GlobalAdminOptionTypeService } from 'src/app/shared/services/global-admin-option-type.service';

interface State {
  loading: boolean;
  countryCodes?: ShallowOptionType[];
}

@Injectable()
export class OrganizationsDialogComponentStore extends ComponentStore<State> {
  public readonly countryCodes$ = this.select((state) => state.countryCodes);
  public readonly loading$ = this.select((state) => state.loading);

  constructor(private globalAdminOptionTypesService: GlobalAdminOptionTypeService) {
    super({ loading: false });
  }

  private readonly setCountryCodes = this.updater(
    (state, countryCodes: ShallowOptionType[]): State => ({ ...state, countryCodes })
  );

  private readonly setLoading = this.updater((state, loading: boolean): State => ({ ...state, loading }));

  public getCountryCodes = this.effect<void>((trigger$) =>
    trigger$.pipe(
      first(),
      tap(() => this.setLoading(true)),
      switchMap(() => {
        return this.globalAdminOptionTypesService.getGlobalOptions('organization_country-code').pipe(
          tapResponse(
            (countryCodeDtos) => {
              this.setCountryCodes(countryCodeDtos);
            },
            (e) => console.error(e),
            () => this.setLoading(false)
          )
        );
      })
    )
  );
}
