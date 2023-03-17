import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { mergeMap, of, withLatestFrom } from 'rxjs';
import { APIV2OrganizationService } from 'src/app/api/v2';
import { selectOrganization, selectUser } from 'src/app/store/user-store/selectors';
import { filterNullish } from '../pipes/filter-nullish';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  public verifiedUserOrganizations$ = this.store.select(selectUser).pipe(
    filterNullish(),
    withLatestFrom(this.store.select(selectOrganization)),
    mergeMap(([_, persistedOrganization]) => {
      if (!persistedOrganization) return of([]);

      // Check if users persisted organization exists
      return this.apiOrganizationService.gETOrganizationV2GetOrganizationsBoundedPaginationQueryPaginationBooleanOnlyWhereUserHasMembershipStringCvrContentStringNameContentStringNameOrCvrContent(
        true,
        persistedOrganization.name
      );
    }),
    mergeMap((organizations) => {
      if (organizations.length === 1) return of(organizations);

      // Find out if user is part of zero, one or multiple organizations
      return this.apiOrganizationService.gETOrganizationV2GetOrganizationsBoundedPaginationQueryPaginationBooleanOnlyWhereUserHasMembershipStringCvrContentStringNameContentStringNameOrCvrContent(
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        2
      );
    })
  );

  constructor(private store: Store, private apiOrganizationService: APIV2OrganizationService) {}
}
