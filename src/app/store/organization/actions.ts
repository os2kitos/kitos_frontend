import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIOrganizationResponseDTO } from 'src/app/api/v2';

export const OrganizationActions = createActionGroup({
  source: 'Organization',
  events: {
    'Get organizations': emptyProps(),
    'Get organizations Success': (organizations: APIOrganizationResponseDTO[]) => ({
      organizations,
    }),
    'Get organizations Error': emptyProps(),
  },
});
