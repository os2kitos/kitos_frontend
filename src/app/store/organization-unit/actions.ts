import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';

export interface IGetAllUnitsParams {
  organizationUuid: string;
  units: APIOrganizationUnitResponseDTO[];
  currentPage?: number;
}

export const OrganizationUnitActions = createActionGroup({
  source: 'OrganizationUnit',
  events: {
    'Get organization units': (
      organizationUuid: string,
      pageSize?: number,
      currentPage?: number,
      units?: APIOrganizationUnitResponseDTO[]
    ) => ({ organizationUuid, units, currentPage, pageSize }),
    'Get organization units Success': (units: APIOrganizationUnitResponseDTO[]) => ({
      units,
    }),
    'Get organization units Error': emptyProps(),
  },
});
