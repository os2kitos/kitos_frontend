import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';
import { Organization } from 'src/app/shared/models/organization.model';

const organizationSelector = new EntitySelectorsFactory().create<Organization>('Organization');

export const selectOrganizations = createSelector(
  organizationSelector.selectEntities,
  (organizations) => organizations
);

export const selectHasMultipleOrganizations = createSelector(
  organizationSelector.selectEntities,
  (organizations) => organizations.length > 1
);
