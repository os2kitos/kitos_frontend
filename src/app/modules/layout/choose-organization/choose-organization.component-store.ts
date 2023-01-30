import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { switchMap, tap } from 'rxjs';
import { APIOrganizationResponseDTO, APIV2OrganizationService } from 'src/app/api/v2';

interface OrganizationComponentStoreState {
  loading: boolean;
  organizations: APIOrganizationResponseDTO[];
}

@Injectable({ providedIn: 'any' })
export class ChooseOrganizationComponentStore extends ComponentStore<OrganizationComponentStoreState> {
  constructor(private organizationService: APIV2OrganizationService) {
    super({
      loading: false,
      organizations: [],
    });
  }

  public loading$ = this.select((state) => state.loading);
  public organizations$ = this.select((state) => state.organizations);

  private updateLoading = this.updater(
    (state, loading: boolean): OrganizationComponentStoreState => ({
      ...state,
      loading,
    })
  );

  private updateOrganizations = this.updater(
    (state, organizations: APIOrganizationResponseDTO[]): OrganizationComponentStoreState => ({
      ...state,
      loading: false,
      organizations,
    })
  );

  public getOrganizations = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.updateLoading(true)),
      switchMap(() =>
        this.organizationService
          .gETOrganizationV2GetOrganizationsBoundedPaginationQueryPaginationBooleanOnlyWhereUserHasMembershipStringCvrContentStringNameContent()
          .pipe(
            tapResponse(
              (organizations) => this.updateOrganizations(organizations),
              (e) => {
                console.error(e);
                this.updateLoading(false);
              }
            )
          )
      )
    )
  );
}
