import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, mergeMap, tap } from 'rxjs';
import { APIOrganizationResponseDTO, APIV2OrganizationService } from 'src/app/api/v2';

interface State {
  organizations?: APIOrganizationResponseDTO[];
  loading: boolean;
}

@Injectable()
export class ChooseOrganizationComponentStore extends ComponentStore<State> {
  public readonly PAGE_SIZE = 250;

  public readonly organizations$ = this.select((state) => state.organizations);
  public readonly loading$ = this.select((state) => state.loading);

  constructor(private apiOrganizationService: APIV2OrganizationService) {
    super({ loading: false });
  }

  private updateOrganizations = this.updater(
    (state, organizations: APIOrganizationResponseDTO[]): State => ({
      ...state,
      organizations,
    })
  );

  private updateLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  public getOrganizations = this.effect((organizationName$: Observable<string | undefined>) =>
    organizationName$.pipe(
      tap(() => this.updateLoading(true)),
      mergeMap((organizationName) =>
        this.apiOrganizationService
          .getManyOrganizationV2GetOrganizations({
            onlyWhereUserHasMembership: true,
            pageSize: this.PAGE_SIZE,
            nameContent: organizationName,
            orderByProperty: 'Name',
          })
          .pipe(
            tapResponse(
              (organizations) => this.updateOrganizations(organizations),
              (e) => console.error(e),
              () => this.updateLoading(false)
            )
          )
      )
    )
  );
}
