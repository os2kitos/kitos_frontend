import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, mergeMap, of, withLatestFrom } from 'rxjs';
import { APIOrganizationResponseDTO, APIV2OrganizationService } from 'src/app/api/v2';
import { selectOrganization, selectUserUuid } from 'src/app/store/user-store/selectors';
import { filterNullish } from '../pipes/filter-nullish';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  //subscribe to user uuid to only trigger when user changes, and prevent unnecessary API calls if a single user property is updated
  public verifiedUserOrganization$ = this.store.select(selectUserUuid).pipe(
    filterNullish(),
    withLatestFrom(this.store.select(selectOrganization)),
    // Check if users persisted organization exists
    mergeMap(([_, persistedOrganization]) => {
      if (!persistedOrganization) return of(undefined);

      return this.apiOrganizationService
        .getManyOrganizationV2GetOrganizations({ onlyWhereUserHasMembership: true, uuid: persistedOrganization.uuid })
        .pipe(map((organizations) => organizations[0]));
    }),
    // Find out if user is part of zero, one or multiple organizations
    mergeMap((organization?: APIOrganizationResponseDTO) =>
      this.apiOrganizationService
        .getManyOrganizationV2GetOrganizations({ onlyWhereUserHasMembership: true, pageSize: 2 })
        .pipe(map((organizations) => ({ organization, organizations })))
    )
  );

  constructor(private store: Store, private apiOrganizationService: APIV2OrganizationService) {}
}
