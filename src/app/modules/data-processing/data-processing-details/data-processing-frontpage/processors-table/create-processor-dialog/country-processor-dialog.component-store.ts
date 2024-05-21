import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Observable, combineLatestWith, mergeMap, tap } from 'rxjs';
import { APIOrganizationResponseDTO, APIV2OrganizationService } from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  loading: boolean;
  organizations?: Array<APIOrganizationResponseDTO>;
}
@Injectable()
export class CreateProcessorDialogComponentStore extends ComponentStore<State> {
  public readonly organizations$ = this.select((state) => state.organizations).pipe(filterNullish());
  public readonly isLoading$ = this.select((state) => state.loading);

  constructor(private store: Store, private apiOrganizationService: APIV2OrganizationService) {
    super({ loading: false });
  }

  private updateOrganizations = this.updater(
    (state, organizations: Array<APIOrganizationResponseDTO>): State => ({
      ...state,
      organizations,
    })
  );

  private updateIsLoading = this.updater(
    (state, loading: boolean): State => ({
      ...state,
      loading,
    })
  );

  public getOrganizations = this.effect((existingUuids$: Observable<string[] | undefined>) =>
    existingUuids$.pipe(
      tap(() => this.updateIsLoading(true)),
      combineLatestWith(this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      mergeMap(([uuids, orgUuid]) => {
        this.updateIsLoading(true);
        return this.apiOrganizationService.getManyOrganizationV2GetOrganizations({ uuid: orgUuid }).pipe(
          tapResponse(
            (organizations) => this.updateOrganizations(organizations.filter((org) => !uuids?.includes(org.uuid))),
            (e) => console.error(e),
            () => this.updateIsLoading(false)
          )
        );
      })
    )
  );
}
