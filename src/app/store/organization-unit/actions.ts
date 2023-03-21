import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';

export const OrganizationUnitActions = createActionGroup({
  source: 'OrganizationUnit',
  events: {
    'Get organization units': (organizationUuid: string) => ({ organizationUuid }),
    'Get organization units Success': (units: APIOrganizationUnitResponseDTO[]) => ({
      units,
    }),
    'Get organization units Error': emptyProps(),
  },
});
