import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APICreateOrganizationUnitRequestDTO,
  APIOrganizationUnitResponseDTO,
  APIUpdateOrganizationUnitRequestDTO,
} from 'src/app/api/v2';

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

    'Create organization subunit': (subunitToCreate: APICreateOrganizationUnitRequestDTO) => ({ subunitToCreate }),
    'Create organization subunit Success': (unit: APIOrganizationUnitResponseDTO) => ({ unit }),
    'Create organization subunit Error': emptyProps(),

    'Patch organization unit': (unitUuid: string, request: APIUpdateOrganizationUnitRequestDTO) => ({
      unitUuid,
      request,
    }),
    'Patch organization unit Success': (unit: APIOrganizationUnitResponseDTO) => ({ unit }),
    'Patch organization unit Error': emptyProps(),

    'Update hierarchy': (unit: APIOrganizationUnitResponseDTO, units: APIOrganizationUnitResponseDTO[]) => ({
      unit,
      units,
    }),
    'Add expanded node': (uuid: string) => ({ uuid }),
    'Remove expanded node': (uuid: string) => ({ uuid }),

    'Get registrations': (unitUuid: string) => ({ unitUuid }),
    'Get registrations Success': (registrations: any) => ({ registrations }),
    'Get registrations Error': emptyProps(),
  },
});
