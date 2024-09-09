import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';

export const OrganizationUnitActions = createActionGroup({
  source: 'OrganizationUnit',
  events: {
    'Get organization units': (pageSize?: number, currentPage?: number, units?: APIOrganizationUnitResponseDTO[]) => ({
      units,
      currentPage,
      pageSize,
    }),
    'Get organization units Success': (units: APIOrganizationUnitResponseDTO[]) => ({
      units,
    }),
    'Get organization units Error': emptyProps(),

    'Get hierarchy': (organizationUuid: string) => ({ organizationUuid }),
    'Get hierarchy Success': (hierarchy: APIOrganizationUnitResponseDTO[]) => ({ hierarchy }),
    'Get hierarchy Error': emptyProps(),

    'Create organization subunit': (subunitToCreate: {parentUnitUuid: string, name: string, ean: number | undefined, localId: string | undefined}) => ({ subunitToCreate }),
    'Create organization subunit Success': (unitName: string) => ({ unitName }),
    'Create organization subunit Error': (unitName: string) => ({ unitName }),
  },
});
