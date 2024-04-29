import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Observable, combineLatestWith, switchMap, tap } from 'rxjs';
import { APIOrganizationUnitResponseDTO, APIV2OrganizationService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  units?: APIOrganizationUnitResponseDTO[];
  isLoading: boolean;
}
@Injectable()
export class PaymentDialogComponentStore extends ComponentStore<State> {
  public readonly units$ = this.select((state) => state.units).pipe(filterNullish());
  public readonly isLoading$ = this.select((state) => state.isLoading);

  constructor(private readonly store: Store, private readonly organizationApiService: APIV2OrganizationService) {
    super({ isLoading: false });
  }

  private updateUnits = this.updater((state, units: APIOrganizationUnitResponseDTO[]): State => ({ ...state, units }));

  private updateIsLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading }));

  public searchOrganizationUnits = this.effect((searchTerm$: Observable<string | undefined>) =>
    searchTerm$.pipe(
      tap(() => this.updateIsLoading(true)),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([searchTerm, organizationUuid]) => {
        return this.organizationApiService
          .getManyOrganizationV2GetOrganizationUnits({
            organizationUuid,
            nameQuery: searchTerm,
          })
          .pipe(
            tapResponse(
              (units) => this.updateUnits(units),
              (e) => console.error(e),
              () => this.updateIsLoading(false)
            )
          );
      })
    )
  );
}
