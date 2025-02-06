import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { mergeMap, Observable, tap } from 'rxjs';
import { APIOrganizationResponseDTO, APIV2OrganizationService } from 'src/app/api/v2';

interface State {
  organizations: APIOrganizationResponseDTO[];
  loading: boolean;
}

@Injectable()
export class OrganizationDropdownComponentStore extends ComponentStore<State> {
  public readonly organizations$ = this.select((state) => state.organizations);
  public readonly loading$ = this.select((state) => state.loading);

  constructor(private organizationService: APIV2OrganizationService) {
    super({ organizations: [], loading: false });
  }

  private setOrganizations = this.updater(
    (state, users: APIOrganizationResponseDTO[]): State => ({
      ...state,
      organizations: users,
    })
  );

  private setLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  public searchOrganizations = this.effect((search$: Observable<string | undefined>) =>
    search$.pipe(
      tap(() => this.setLoading(true)),
      mergeMap((search) => {
        return this.organizationService
          .getManyOrganizationV2GetOrganizations({
            nameOrCvrContent: search,
          })
          .pipe(
            tapResponse(
              (filteredUsers) => this.setOrganizations(filteredUsers),
              (error) => console.error(error),
              () => this.setLoading(false)
            )
          );
      })
    )
  );
}
