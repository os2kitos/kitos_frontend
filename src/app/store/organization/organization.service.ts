import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Organization } from 'src/app/shared/models/organization.model';

@Injectable({ providedIn: 'root' })
export class OrganizationService extends EntityCollectionServiceBase<Organization> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Organization', serviceElementsFactory);
  }
}
