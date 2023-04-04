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
      currentPage?: number,
      units?: APIOrganizationUnitResponseDTO[]
    ) => ({ organizationUuid, units, currentPage }),
    'Get organization units Success': (units: APIOrganizationUnitResponseDTO[]) => ({
      units,
    }),
    'Get organization units Error': emptyProps(),
  },
});
