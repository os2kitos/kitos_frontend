import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { map, Observable } from 'rxjs';
import { APIV2OrganizationService } from 'src/app/api/v2';
import { adaptOrganization, Organization } from 'src/app/shared/models/organization.model';

@Injectable()
export class OrganizationDataService extends DefaultDataService<Organization> {
  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    private apiOrganizationService: APIV2OrganizationService
  ) {
    super('Organization', http, httpUrlGenerator);
  }

  override getAll(): Observable<Organization[]> {
    return this.apiOrganizationService
      .gETOrganizationV2GetOrganizationsBoundedPaginationQueryPaginationBooleanOnlyWhereUserHasMembershipStringCvrContentStringNameContentStringNameOrCvrContent(
        true
      )
      .pipe(map((organizations) => organizations.map(adaptOrganization)));
  }
}
