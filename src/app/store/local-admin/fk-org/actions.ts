import { createActionGroup, emptyProps } from '@ngrx/store';
import {
  APIConnectToStsOrganizationRequestDTO,
  APIStsOrganizationOrgUnitDTO,
  APIStsOrganizationSynchronizationDetailsResponseDTO,
} from 'src/app/api/v2';

export const FkOrgActions = createActionGroup({
  source: 'FkOrg',
  events: {
    'Get Synchronization Status': emptyProps(),
    'Get Synchronization Status Success ': (
      synchronizationStatus: APIStsOrganizationSynchronizationDetailsResponseDTO
    ) => ({ synchronizationStatus }),
    'Get Synchronization Status Error': emptyProps(),

    'Get Snapshot': emptyProps(),
    'Get Snapshot Success': (snapshot: APIStsOrganizationOrgUnitDTO) => ({ snapshot }),
    'Get Snapshot Error': emptyProps(),

    'Create Connection': (request: APIConnectToStsOrganizationRequestDTO) => ({ request }),
    'Create Connection Success': emptyProps(),
    'Create Connection Error': emptyProps(),
  },
});
